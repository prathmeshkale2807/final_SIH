/**
 * AI Quality Detection Service (KRISHAK AI Computer Vision Engine)
 * 
 * Provides simulated computer vision produce analysis with YOLO-style bounding boxes,
 * weighted multi-parameter score calculation, and AGMARKNET grade classification.
 * 
 * Future Backend Integration Architecture:
 * Frontend -> analyzeProduce(image) -> POST /api/analyze-produce -> Python YOLOv8 Service -> Quality Response
 */

/**
 * Standard Quality Grade Classifier
 * @param {number} overallScore - Score between 0 and 100
 * @returns {object} Grade classification metadata
 */
export const getQualityGrade = (overallScore) => {
  const score = Number(overallScore) || 0;

  if (score >= 85) {
    return {
      grade: 'Grade A',
      dropdownValue: 'Grade A (Export / Processing Quality)',
      qualityText: 'Premium Quality',
      subtitle: 'Suitable for market sale & institutional procurement',
      color: 'emerald',
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-300',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  }

  if (score >= 60) {
    return {
      grade: 'Grade B',
      dropdownValue: 'Grade B (Standard Mandi Quality)',
      qualityText: 'Standard Market Quality',
      subtitle: 'Suitable for general APMC trading & domestic wholesale',
      color: 'amber',
      bgClass: 'bg-amber-500',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-300',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    };
  }

  return {
    grade: 'Grade C',
    dropdownValue: 'Grade C (Local Consumption)',
    qualityText: 'Processing / Local Quality',
    subtitle: 'Suitable for immediate local retail or value-added processing',
    color: 'rose',
    bgClass: 'bg-rose-500',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-300',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  };
};

/**
 * Calculates overall quality score using standardized weights:
 * - Color & Ripeness: 25%
 * - Surface Condition: 30%
 * - Visual Freshness: 20%
 * - Shape: 10%
 * - Size Uniformity: 15%
 */
export const calculateOverallScore = ({
  colorScore = 94,
  surfaceScore = 90,
  freshnessScore = 92,
  shapeScore = 90,
  uniformityScore = 88,
}) => {
  const weighted =
    colorScore * 0.25 +
    surfaceScore * 0.3 +
    freshnessScore * 0.2 +
    shapeScore * 0.1 +
    uniformityScore * 0.15;

  return Math.round(weighted);
};

/**
 * High-definition farm-fresh tomato demonstration image directly on the plant
 */
export const DEFAULT_FARM_TOMATO_IMAGE =
  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=85';

/**
 * Simulated Produce Quality Analysis Engine
 * @param {string|File} image - Image data URL or file object
 * @param {string} commodity - Crop name (e.g., 'Tomato', 'Onion')
 * @returns {Promise<object>}
 */
export const analyzeProduce = async (image, commodity = 'Tomato') => {
  // In future: return axios.post('/api/analyze-produce', formData);
  
  // High-fidelity simulation for client demo
  const isTomato = commodity.toLowerCase().includes('tomato') || !commodity;
  const isFruit = commodity.toLowerCase().includes('pomegranate') || commodity.toLowerCase().includes('grape') || commodity.toLowerCase().includes('orange');

  const metrics = {
    colorScore: 94,
    surfaceScore: 90,
    freshnessScore: 92,
    shapeScore: 90,
    uniformityScore: 88,
    defectLevel: 'Low (0.8% blemish)',
  };

  const overallScore = calculateOverallScore(metrics);
  const gradeInfo = getQualityGrade(overallScore);

  const detections = [
    { id: 1, label: isTomato ? 'Tomato' : isFruit ? 'Produce' : 'Vegetable', confidence: 0.98, box: { top: 22, left: 16, width: 28, height: 30 } },
    { id: 2, label: isTomato ? 'Tomato' : isFruit ? 'Produce' : 'Vegetable', confidence: 0.96, box: { top: 32, left: 48, width: 30, height: 32 } },
    { id: 3, label: isTomato ? 'Tomato' : isFruit ? 'Produce' : 'Vegetable', confidence: 0.97, box: { top: 12, left: 62, width: 24, height: 26 } },
    { id: 4, label: isTomato ? 'Tomato' : isFruit ? 'Produce' : 'Vegetable', confidence: 0.95, box: { top: 54, left: 22, width: 26, height: 28 } },
    { id: 5, label: isTomato ? 'Tomato' : isFruit ? 'Produce' : 'Vegetable', confidence: 0.94, box: { top: 60, left: 56, width: 27, height: 29 } },
  ];

  return {
    product: commodity || 'Tomato (Farm Fresh)',
    detectedCount: 12,
    detections,
    metrics,
    overallScore,
    gradeInfo,
    weights: {
      color: '25%',
      surface: '30%',
      freshness: '20%',
      shape: '10%',
      uniformity: '15%',
    },
    summaryText: 'Individual produce items identified and evaluated across skin luster, ripeness index, and size consistency.',
  };
};
