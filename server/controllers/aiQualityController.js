/**
 * KRISHAK AI Quality Controller — 3-Stage Gemini Vision Pipeline
 *
 * Stage 1: Crop Verification — "Is this really [selectedCrop]?"
 * Stage 2: Quality Grading — Crop-specific visual quality evaluation
 * Stage 3: Quantity Estimation — Count, size, weight estimate
 *
 * Each stage uses an independent Gemini Vision API call with a specialized prompt.
 * NO fake data. NO random values. NO Canvas pixel analysis.
 */

// ─── GEMINI API HELPER ───────────────────────────────────────────────────────

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

/**
 * Calls Gemini Vision API with an image and a text prompt.
 * Returns parsed JSON or throws an error.
 */
async function callGeminiVision(apiKey, base64ImageData, mimeType, promptText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64ImageData,
              },
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Gemini API ${response.status}: ${errorBody.substring(0, 300)}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini returned empty response — no candidates or text.');
  }

  // Safely parse JSON — handle markdown code fences if present
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
  }

  try {
    return JSON.parse(cleanText);
  } catch (parseErr) {
    console.error('[Gemini Parse] Raw text:', rawText.substring(0, 500));
    throw new Error('Gemini returned invalid JSON: ' + parseErr.message);
  }
}

// ─── STAGE 1: CROP VERIFICATION ─────────────────────────────────────────────

async function verifyCrop(apiKey, base64Data, mimeType, selectedCrop) {
  const prompt = `You are a strict agricultural crop verification vision system.

Analyze the supplied photograph.

The farmer selected crop is: "${selectedCrop}"

Your ONLY task is to determine:
1. What is ACTUALLY visible in this image?
2. Does the image contain the selected crop ("${selectedCrop}")?
3. Is the image clear enough for quality analysis?

STRICT RULES:
- Use ONLY visual evidence from the image. Do NOT assume the selected crop is present.
- If you see a person, face, hand, laptop, phone, desk, wall, ceiling, floor, or any non-agricultural object and NO "${selectedCrop}" is visible, set verified=false.
- If you see a DIFFERENT crop/produce (e.g., tomato when "${selectedCrop}" was selected), set verified=false and report what you actually see.
- If "${selectedCrop}" IS clearly visible, set verified=true.
- If the image is too blurry, dark, or unclear to determine the crop, set verified=false and explain why.

Return ONLY this JSON (no extra text):
{
  "verified": false,
  "confidence": 0.0,
  "detected_crop": "",
  "what_i_see": "",
  "image_quality": "good",
  "reason": ""
}

Fields:
- verified: boolean — true ONLY if "${selectedCrop}" is visually confirmed
- confidence: number 0.0 to 1.0 — how confident you are in the identification
- detected_crop: string — the crop/object you ACTUALLY see (e.g., "tomato", "onion", "person", "desk", "unknown")
- what_i_see: string — brief description of what is visible in the image
- image_quality: "good" | "acceptable" | "poor" — clarity of the image
- reason: string — explanation if verified=false`;

  const result = await callGeminiVision(apiKey, base64Data, mimeType, prompt);

  // Validate required fields
  return {
    verified: Boolean(result.verified),
    confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0,
    detected_crop: String(result.detected_crop || 'unknown'),
    what_i_see: String(result.what_i_see || ''),
    image_quality: ['good', 'acceptable', 'poor'].includes(result.image_quality) ? result.image_quality : 'unknown',
    reason: String(result.reason || ''),
  };
}

// ─── STAGE 2: QUALITY GRADING ────────────────────────────────────────────────

async function gradeQuality(apiKey, base64Data, mimeType, selectedCrop) {
  const prompt = `You are an expert agricultural produce quality grading system.

The crop in this image has been verified as: "${selectedCrop}"

Analyze the VISIBLE quality characteristics of the "${selectedCrop}" in this photograph.

Evaluate ONLY what you can visually determine:
- Color and ripeness/maturity
- Surface condition (smooth, rough, damaged)
- Visible defects (bruises, rot, mold, cracks, cuts, discoloration, pest damage, sprouting)
- Overall freshness appearance
- Shape and size uniformity (if multiple units)

IMPORTANT RULES:
- Do NOT measure things that cannot be determined from a photograph (e.g., exact firmness, internal sugar content, weight).
- For such non-visual metrics, use "not_visually_measurable" as the value.
- Be HONEST about quality. Do NOT inflate scores.
- If the produce looks damaged, say so. If it looks premium, say so.
- freshness_score is 0 to 100 where 100 is perfectly fresh and 0 is completely spoiled.

Return ONLY this JSON:
{
  "grade": "A",
  "freshness_score": 0,
  "defects": [],
  "metrics": {
    "color": "",
    "maturity": "",
    "surface_condition": "",
    "uniformity": ""
  },
  "summary": ""
}

Fields:
- grade: "A" (premium/export quality) | "B" (standard market quality) | "C" (local consumption) | "Rejected" (severely damaged/spoiled)
- freshness_score: integer 0-100 based on visible appearance
- defects: array of strings describing each visible defect, e.g., ["minor bruising on top", "small crack near stem"]. Empty array if no defects visible.
- metrics.color: describe the visible color (e.g., "deep red, evenly colored")
- metrics.maturity: describe ripeness stage (e.g., "fully ripe", "slightly underripe", "overripe")
- metrics.surface_condition: describe surface (e.g., "smooth and clean", "minor scratches", "rough with spots")
- metrics.uniformity: if multiple units visible, describe uniformity (e.g., "uniform size", "mixed sizes"). If single unit, say "single unit"
- summary: 1-2 sentence farmer-friendly summary of the quality assessment`;

  const result = await callGeminiVision(apiKey, base64Data, mimeType, prompt);

  // Validate and normalize
  const validGrades = ['A', 'B', 'C', 'Rejected'];
  return {
    available: true,
    grade: validGrades.includes(result.grade) ? result.grade : 'B',
    freshness_score: typeof result.freshness_score === 'number' ? Math.max(0, Math.min(100, Math.round(result.freshness_score))) : 0,
    defects: Array.isArray(result.defects) ? result.defects.map(String) : [],
    metrics: {
      color: String(result.metrics?.color || 'not determined'),
      maturity: String(result.metrics?.maturity || 'not determined'),
      surface_condition: String(result.metrics?.surface_condition || 'not determined'),
      uniformity: String(result.metrics?.uniformity || 'not determined'),
    },
    summary: String(result.summary || ''),
  };
}

// ─── STAGE 3: QUANTITY ESTIMATION ────────────────────────────────────────────

async function estimateQuantity(apiKey, base64Data, mimeType, selectedCrop) {
  const prompt = `You are a visual produce quantity estimation system.

Analyze the supplied photograph.

The crop in this image is: "${selectedCrop}"

Your task is to:
1. Count the individual visible units of "${selectedCrop}" in the image.
2. Estimate the average size class.
3. Provide a rough weight estimate range.

STRICT RULES:
- Count ONLY visible "${selectedCrop}" units. Do NOT count other objects.
- Do NOT invent hidden units. If units overlap or are partially hidden, state that the count is an estimate.
- If you cannot reliably count (e.g., pile of small items), provide your best estimate and note low confidence.
- Weight is ALWAYS an estimate range, NEVER an exact number.
- If you cannot estimate weight from the image, set min and max to null.

Return ONLY this JSON:
{
  "count": 0,
  "confidence": 0.0,
  "size_class": "unknown",
  "weight_estimate_kg": {
    "min": null,
    "max": null
  },
  "visibility": "clear",
  "notes": ""
}

Fields:
- count: integer — number of individual "${selectedCrop}" units visible
- confidence: number 0.0 to 1.0 — how confident you are in the count
- size_class: "small" | "medium" | "large" | "mixed" | "unknown"
- weight_estimate_kg.min: number or null — minimum estimated total weight in kg
- weight_estimate_kg.max: number or null — maximum estimated total weight in kg
- visibility: "clear" (all units fully visible) | "partial" (some overlap/occlusion) | "poor" (heavily piled/unclear)
- notes: string — any important notes about the estimate`;

  const result = await callGeminiVision(apiKey, base64Data, mimeType, prompt);

  // Validate and normalize
  const validSizes = ['small', 'medium', 'large', 'mixed', 'unknown'];
  const validVisibility = ['clear', 'partial', 'poor'];

  return {
    available: true,
    count: typeof result.count === 'number' ? Math.max(0, Math.round(result.count)) : 0,
    confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0,
    size_class: validSizes.includes(result.size_class) ? result.size_class : 'unknown',
    weight_estimate_kg: {
      min: typeof result.weight_estimate_kg?.min === 'number' ? result.weight_estimate_kg.min : null,
      max: typeof result.weight_estimate_kg?.max === 'number' ? result.weight_estimate_kg.max : null,
    },
    visibility: validVisibility.includes(result.visibility) ? result.visibility : 'unknown',
    notes: String(result.notes || ''),
  };
}

// ─── IMAGE PREPROCESSING ─────────────────────────────────────────────────────

function preprocessImage(base64Input) {
  // Extract MIME type and raw base64 data
  let mimeType = 'image/jpeg';
  let base64Data = base64Input;

  if (base64Input.includes(',')) {
    const header = base64Input.split(',')[0];
    base64Data = base64Input.split(',')[1];

    // Extract MIME from data URI
    const mimeMatch = header.match(/data:([^;]+);/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }
  }

  // Validate MIME type
  const supportedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  if (!supportedMimes.includes(mimeType)) {
    mimeType = 'image/jpeg'; // Default fallback
  }

  // Validate base64 is not empty
  if (!base64Data || base64Data.length < 100) {
    throw new Error('Image data is too small or empty.');
  }

  // Check approximate file size (base64 is ~4/3 of binary)
  const approxSizeBytes = (base64Data.length * 3) / 4;
  const maxSizeMB = 20;
  if (approxSizeBytes > maxSizeMB * 1024 * 1024) {
    throw new Error(`Image is too large (>${maxSizeMB}MB). Please use a smaller image.`);
  }

  return { base64Data, mimeType };
}

// ─── MAIN 3-STAGE PIPELINE ENDPOINT ──────────────────────────────────────────

export const analyzeProducePipeline = async (req, res) => {
  const startTime = Date.now();

  try {
    const { image, selectedProduce, requestId } = req.body;

    // ── Validate input ──
    if (!image) {
      return res.status(400).json({
        success: false,
        errorCode: 'NO_IMAGE_PROVIDED',
        message: 'No image was provided. Please upload or capture a photo of your produce.',
      });
    }

    if (!selectedProduce) {
      return res.status(400).json({
        success: false,
        errorCode: 'NO_CROP_SELECTED',
        message: 'No crop was selected. Please select the crop type before analyzing.',
      });
    }

    // ── Check Gemini API Key ──
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.status(503).json({
        success: false,
        errorCode: 'GEMINI_API_KEY_MISSING',
        message: 'AI vision is not configured. Please add GEMINI_API_KEY to environment variables.',
      });
    }

    // ── Preprocess image ──
    let imageData;
    try {
      imageData = preprocessImage(image);
    } catch (imgErr) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_IMAGE',
        message: imgErr.message,
      });
    }

    const { base64Data, mimeType } = imageData;
    const selectedCrop = String(selectedProduce).trim();

    // ════════════════════════════════════════════════════════
    // STAGE 1: CROP VERIFICATION
    // ════════════════════════════════════════════════════════
    let verification;
    try {
      verification = await verifyCrop(geminiKey, base64Data, mimeType, selectedCrop);
    } catch (stage1Err) {
      console.error('[Stage 1 Error]', stage1Err.message);
      return res.status(200).json({
        success: false,
        errorCode: 'VISION_VERIFICATION_FAILED',
        message: 'AI vision analysis could not verify the image. Please try again.',
        stage: 'verification',
        error_detail: stage1Err.message,
        requestId,
        elapsed_ms: Date.now() - startTime,
      });
    }

    // If verification failed — STOP. Do not run quality/quantity.
    if (!verification.verified) {
      let userMessage = '';
      const detectedCrop = verification.detected_crop?.toLowerCase();
      const selectedLower = selectedCrop.toLowerCase();

      if (detectedCrop && detectedCrop !== 'unknown' && detectedCrop !== selectedLower && !detectedCrop.includes(selectedLower)) {
        // Case 2: Wrong crop detected
        userMessage = `${verification.detected_crop} detected, but ${selectedCrop} was selected. Please upload a photo of ${selectedCrop}.`;
      } else if (verification.image_quality === 'poor') {
        // Case: Bad image quality
        userMessage = `Image is too unclear for analysis. ${verification.reason || 'Please upload a clearer photo with good lighting.'}`;
      } else {
        // Case 1: No produce / person / desk / etc.
        userMessage = `No ${selectedCrop} detected. ${verification.what_i_see ? `The AI sees: ${verification.what_i_see}.` : ''} Please upload a clear photo of ${selectedCrop}.`;
      }

      return res.status(200).json({
        success: true,
        requestId,
        elapsed_ms: Date.now() - startTime,
        verification: {
          ...verification,
          stage_completed: true,
        },
        quality: { available: false },
        quantity: { available: false },
        message: userMessage,
      });
    }

    // ════════════════════════════════════════════════════════
    // STAGE 2: QUALITY GRADING (only if verified)
    // ════════════════════════════════════════════════════════
    let quality;
    try {
      quality = await gradeQuality(geminiKey, base64Data, mimeType, selectedCrop);
    } catch (stage2Err) {
      console.error('[Stage 2 Error]', stage2Err.message);
      quality = {
        available: false,
        error: 'QUALITY_ANALYSIS_FAILED',
        error_detail: stage2Err.message,
      };
    }

    // ════════════════════════════════════════════════════════
    // STAGE 3: QUANTITY ESTIMATION (only if verified)
    // ════════════════════════════════════════════════════════
    let quantity;
    try {
      quantity = await estimateQuantity(geminiKey, base64Data, mimeType, selectedCrop);
    } catch (stage3Err) {
      console.error('[Stage 3 Error]', stage3Err.message);
      quantity = {
        available: false,
        error: 'QUANTITY_ESTIMATION_FAILED',
        error_detail: stage3Err.message,
      };
    }

    // ════════════════════════════════════════════════════════
    // COMBINED RESPONSE
    // ════════════════════════════════════════════════════════
    return res.status(200).json({
      success: true,
      requestId,
      elapsed_ms: Date.now() - startTime,
      verification: {
        ...verification,
        stage_completed: true,
      },
      quality,
      quantity,
      message: `${selectedCrop} verified and analyzed successfully.`,
    });
  } catch (err) {
    console.error('[AI Quality Pipeline] Unhandled error:', err);
    return res.status(500).json({
      success: false,
      errorCode: 'PIPELINE_ERROR',
      message: 'AI vision analysis encountered an unexpected error. Please try again.',
      error_detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

// ─── LEGACY ENDPOINT (backward compatibility) ────────────────────────────────

export const analyzeProduceVision = async (req, res) => {
  try {
    const { imageBase64, targetCommodity = 'onion', frameId = Date.now() } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'No image frame provided.',
        detected: false,
        count: 0,
        objects: [],
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return res.status(200).json({
        success: false,
        frameId,
        detected: false,
        count: 0,
        objects: [],
        message: 'AI vision is not configured. Add GEMINI_API_KEY to environment variables.',
      });
    }

    // Redirect to the new pipeline internally
    const imageData = preprocessImage(imageBase64);
    const verification = await verifyCrop(geminiKey, imageData.base64Data, imageData.mimeType, targetCommodity);

    return res.status(200).json({
      success: true,
      frameId,
      detected: verification.verified,
      count: verification.verified ? 1 : 0,
      objects: [],
      primary_visible_object: verification.detected_crop,
      message: verification.verified
        ? `${targetCommodity} detected with ${Math.round(verification.confidence * 100)}% confidence.`
        : `No ${targetCommodity} detected. ${verification.what_i_see || ''}`,
    });
  } catch (error) {
    console.error('[AI Quality Controller Legacy] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Computer vision analysis failed: ' + error.message,
      detected: false,
      count: 0,
      objects: [],
    });
  }
};
