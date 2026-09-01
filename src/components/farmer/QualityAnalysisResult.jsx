import React from 'react';

export const QualityAnalysisResult = ({
  result,
  onApplyRecommendation,
  onAddAnotherAngle,
  onReset,
}) => {
  if (!result) return null;

  const {
    detected = false,
    verification,
    quality,
    quantity,
    targetCommodity = 'Produce',
    qualityMetrics,
    overallScore,
    gradeInfo,
    message,
    errorType,
    disclaimer = 'AI visual estimate — based on photograph analysis by Gemini Vision.',
  } = result;

  // ─── CASE 3: API/CONFIG/NETWORK ERROR ───
  if (errorType === 'config_error') {
    return (
      <div className="bg-red-50/80 border-2 border-red-300 rounded-3xl p-5 sm:p-6 text-slate-800 space-y-4 animate-fade-in font-sans">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
            ⚙️
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-red-950">
              AI Vision Not Configured
            </h3>
            <p className="text-xs text-red-900/80 font-medium mt-0.5">
              {message || 'AI vision is temporarily unavailable. Please contact support.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorType === 'network_error' || errorType === 'server_error' || errorType === 'api_error') {
    return (
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 text-slate-800 space-y-4 animate-fade-in font-sans">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-amber-950">
              AI Vision Analysis Unavailable
            </h3>
            <p className="text-xs text-amber-900/80 font-medium mt-0.5">
              {message || 'Could not connect to AI vision server. Please try again.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  // ─── CASE 1 & 2: VERIFICATION FAILED (no produce / wrong produce) ───
  if (!detected) {
    const isWrongCrop = verification?.detected_crop &&
      verification.detected_crop !== 'unknown' &&
      verification.detected_crop.toLowerCase() !== 'person' &&
      verification.detected_crop.toLowerCase() !== 'desk' &&
      verification.detected_crop.toLowerCase() !== 'background';

    return (
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 text-slate-800 space-y-4 animate-fade-in font-sans">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
            {isWrongCrop ? '🔄' : '🔍'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-amber-950">
                {isWrongCrop ? 'Wrong Crop Detected' : 'No Target Produce Detected'}
              </h3>
            </div>
            <p className="text-xs text-amber-900/80 font-medium mt-0.5">
              {message || `No ${targetCommodity || 'produce'} was found in the image.`}
            </p>
          </div>
        </div>

        {/* What the AI sees */}
        {verification && (
          <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-slate-800 block">🤖 What the AI sees:</span>
            <div className="space-y-1.5 text-[11px]">
              {verification.what_i_see && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-600 w-24 flex-shrink-0">Description:</span>
                  <span className="text-slate-700">{verification.what_i_see}</span>
                </div>
              )}
              {verification.detected_crop && verification.detected_crop !== 'unknown' && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-600 w-24 flex-shrink-0">Detected:</span>
                  <span className="text-slate-700 capitalize">{verification.detected_crop}</span>
                </div>
              )}
              {verification.image_quality && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-600 w-24 flex-shrink-0">Image Quality:</span>
                  <span className={`capitalize font-bold ${
                    verification.image_quality === 'good' ? 'text-emerald-700' :
                    verification.image_quality === 'acceptable' ? 'text-amber-700' :
                    'text-red-700'
                  }`}>{verification.image_quality}</span>
                </div>
              )}
              {verification.reason && (
                <div className="flex gap-2">
                  <span className="font-bold text-slate-600 w-24 flex-shrink-0">Reason:</span>
                  <span className="text-slate-700">{verification.reason}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-800 block">💡 Tips for Successful Detection:</span>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
            <li>Ensure the target crop is placed clearly in the photo.</li>
            <li>Use natural daylight and avoid harsh shadows or dark backgrounds.</li>
            <li>Hold the phone steady from a distance of 30–50 cm.</li>
            <li>Make sure the selected crop matches what's in the photo.</li>
          </ul>
        </div>
      </div>
    );
  }

  // ─── SUCCESS: VERIFIED PRODUCE — SHOW ALL 3 STAGE RESULTS ───
  return (
    <div className="space-y-5 animate-fade-in font-sans text-slate-800">
      
      {/* ─── 1. VERIFICATION RESULT ─── */}
      {verification && (
        <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-3xl border border-emerald-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl shadow-inner">
              ✅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-emerald-900">Crop Verified</h3>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                  {Math.round((verification.confidence || 0) * 100)}% Confidence
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                {verification.what_i_see || `${verification.detected_crop} confirmed in image`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. QUALITY GRADE & METRICS ─── */}
      {quality?.available && (
        <>
          {/* Quality Metrics Progress Bars */}
          {qualityMetrics && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📊</span>
                  <span>Visual Quality Parameters</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-medium">Gemini Vision Analysis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                
                {/* Color & Ripeness */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Color & Ripeness</span>
                    <span className="font-mono font-black text-emerald-600">{qualityMetrics.color}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${qualityMetrics.color}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{quality.metrics?.color || 'Visual assessment'}</span>
                </div>

                {/* Surface Condition */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Surface Condition</span>
                    <span className="font-mono font-black text-emerald-600">{qualityMetrics.surface}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${qualityMetrics.surface}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{quality.metrics?.surface_condition || 'Visual assessment'}</span>
                </div>

                {/* Visual Freshness */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Freshness Score</span>
                    <span className="font-mono font-black text-emerald-600">{qualityMetrics.freshness}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${qualityMetrics.freshness}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">{quality.metrics?.maturity || 'Visual assessment'}</span>
                </div>

                {/* Defects */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Visible Defects</span>
                    <span className="font-mono font-black text-emerald-600">{qualityMetrics.defectLevel}</span>
                  </div>
                  {quality.defects?.length > 0 ? (
                    <ul className="text-[10px] text-slate-500 space-y-0.5">
                      {quality.defects.map((d, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-amber-500">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[10px] text-emerald-600 font-medium">No visible defects detected</p>
                  )}
                </div>

                {/* Quality Summary */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5 sm:col-span-2">
                  <div className="text-xs font-bold text-slate-700">AI Quality Summary</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {quality.summary || 'Quality analysis completed.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hero Score & Grade Card */}
          {gradeInfo && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gradient-to-br from-[#062d1f] to-[#041a12] text-white p-5 sm:p-6 rounded-3xl border border-emerald-700/60 shadow-xl items-center">
              
              {/* Score Left (4 cols) */}
              <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-emerald-800/80 pb-4 md:pb-0 md:pr-4">
                <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-3xl font-mono font-black text-emerald-300 shadow-inner flex-shrink-0">
                  {overallScore || 0}
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 block">
                    FRESHNESS SCORE
                  </span>
                  <span className="text-xl font-black text-white font-mono">{overallScore || 0} / 100</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    AI Visual Estimate
                  </span>
                </div>
              </div>

              {/* Grade Center (5 cols) */}
              <div className="md:col-span-5 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block">
                  AI RECOMMENDATION
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {gradeInfo.grade}
                  </span>
                  <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
                    {gradeInfo.badgeLabel}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 font-medium leading-relaxed">
                  {gradeInfo.subtitle}
                </p>
              </div>

              {/* Action Button Right (3 cols) */}
              <div className="md:col-span-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onApplyRecommendation}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>✓ Apply AI Grade</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── 3. QUANTITY ESTIMATION ─── */}
      {quantity?.available && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <span>📦</span>
            <span>Quantity Estimation</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Count */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-center">
              <div className="text-2xl font-black text-emerald-600 font-mono">{quantity.count}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Units Visible</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {Math.round((quantity.confidence || 0) * 100)}% confidence
              </div>
            </div>

            {/* Size Class */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-center">
              <div className="text-lg font-black text-slate-800 capitalize">{quantity.size_class || 'Unknown'}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Size Class</div>
            </div>

            {/* Weight Estimate */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-center">
              <div className="text-lg font-black text-slate-800">
                {quantity.weight_estimate_kg?.min != null && quantity.weight_estimate_kg?.max != null
                  ? `${quantity.weight_estimate_kg.min}–${quantity.weight_estimate_kg.max}`
                  : '—'}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Est. Weight (kg)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Range estimate</div>
            </div>

            {/* Visibility */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-center">
              <div className={`text-lg font-black capitalize ${
                quantity.visibility === 'clear' ? 'text-emerald-600' :
                quantity.visibility === 'partial' ? 'text-amber-600' :
                'text-red-600'
              }`}>{quantity.visibility || 'Unknown'}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Visibility</div>
            </div>
          </div>

          {quantity.notes && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <strong>📝 Notes:</strong> {quantity.notes}
            </p>
          )}
        </div>
      )}

      {/* ─── 4. DISCLAIMER ─── */}
      <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-normal">
        <strong>⚠️ AI Visual Estimate Disclaimer:</strong> {disclaimer}
        {' '}Quantity and weight are visual estimates only — not exact measurements.
      </div>

    </div>
  );
};

export default QualityAnalysisResult;
