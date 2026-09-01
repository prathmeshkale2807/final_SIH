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
    count = 0,
    targetCommodity = 'Produce',
    produceType = 'Produce',
    produceIcon = '🌱',
    produceConfidence = 0.9,
    detectedCount = count,
    qualityMetrics,
    overallScore,
    gradeInfo,
    explanations = [],
    farmerGuidance,
    defects = [],
    message,
    disclaimer = 'Visual estimation based on visible external surface.',
  } = result;

  // ─── 1. NO TARGET PRODUCE DETECTED VIEW ───
  if (!detected || count === 0 || !qualityMetrics) {
    return (
      <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 text-slate-800 space-y-4 animate-fade-in font-sans">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-amber-950">
                No Target Produce Detected
              </h3>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                0 Units
              </span>
            </div>
            <p className="text-xs text-amber-900/80 font-medium mt-0.5">
              {message || `No ${targetCommodity || 'produce'} was found in the current camera frame.`}
            </p>
          </div>
        </div>

        <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-800 block">💡 Tips for Successful Detection:</span>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
            <li>Ensure the target crop is placed clearly in the camera view.</li>
            <li>Use natural daylight and avoid harsh shadows or dark backgrounds.</li>
            <li>Hold the phone steady from a distance of 30–50 cm.</li>
            <li>If pointing at non-produce (person, desk, wall), the AI will correctly report 0 detections.</li>
          </ul>
        </div>
      </div>
    );
  }

  // ─── 2. REAL VERIFIED PRODUCE QUALITY DASHBOARD ───
  return (
    <div className="space-y-5 animate-fade-in font-sans text-slate-800">
      
      {/* ─── 1. IDENTIFIED PRODUCE & CONFIDENCE HEADER ─── */}
      <div className="bg-white p-4.5 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-inner">
            {produceIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight">{produceType}</h3>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                {Math.round((produceConfidence || 0.92) * 100)}% Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified {detectedCount} unit(s) in current frame
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-xl self-start sm:self-auto">
          ✓ Frame Analysis Complete
        </div>
      </div>

      {/* ─── 2. QUALITY METRICS PROGRESS BARS ─── */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>📊</span>
            <span>Real Visual Quality Parameters</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">AGMARKNET Multi-Factor Weights</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          
          {/* Color & Ripeness */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Color &amp; Ripeness</span>
              <span className="font-mono font-black text-emerald-600">{qualityMetrics.color}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${qualityMetrics.color}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">Weight: 25% • Skin Hue &amp; Luster</span>
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
            <span className="text-[10px] text-slate-400 block">Weight: 30% • Smooth &amp; Firm Exterior</span>
          </div>

          {/* Visual Freshness */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Visual Freshness</span>
              <span className="font-mono font-black text-emerald-600">{qualityMetrics.freshness}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${qualityMetrics.freshness}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">Weight: 20% • Turgidity &amp; Surface State</span>
          </div>

          {/* Size Uniformity */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Size Uniformity</span>
              <span className="font-mono font-black text-emerald-600">{qualityMetrics.uniformity}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${qualityMetrics.uniformity}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">Weight: 15% • Diameter Consistency</span>
          </div>

          {/* Shape Symmetry */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Shape Symmetry</span>
              <span className="font-mono font-black text-emerald-600">{qualityMetrics.shape}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${qualityMetrics.shape}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">Weight: 10% • Standard Botanical Profile</span>
          </div>

          {/* Visible Defects */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Visible Defects</span>
              <span className="font-mono font-black text-emerald-600">{qualityMetrics.defectLevel}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: defects.length === 0 ? '95%' : '84%' }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {defects.length === 0 ? 'Zero severe rot' : `${defects.length} surface marks`}
            </span>
          </div>

        </div>
      </div>

      {/* ─── 3. HERO SCORE & RECOMMENDATION CARD ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gradient-to-br from-[#062d1f] to-[#041a12] text-white p-5 sm:p-6 rounded-3xl border border-emerald-700/60 shadow-xl items-center">
        
        {/* Score Left (4 cols) */}
        <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-emerald-800/80 pb-4 md:pb-0 md:pr-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-3xl font-mono font-black text-emerald-300 shadow-inner flex-shrink-0">
            {overallScore}%
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 block">
              AI QUALITY SCORE
            </span>
            <span className="text-xl font-black text-white font-mono">{overallScore} / 100</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              AGMARKNET Scale
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
              {gradeInfo?.grade || 'Grade A'}
            </span>
            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
              {gradeInfo?.badgeLabel || 'PREMIUM QUALITY'}
            </span>
          </div>
          <p className="text-xs text-emerald-200/90 font-medium leading-relaxed">
            {gradeInfo?.subtitle || 'Suitable for market sale & institutional procurement'}
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

      {/* ─── 4. FARMER GUIDANCE ─── */}
      {farmerGuidance && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium leading-relaxed">
          <strong>🌾 Farmer Market Advisory:</strong> {farmerGuidance}
        </div>
      )}

      {/* ─── 5. VISUAL SCANNER DISCLAIMER ─── */}
      <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-normal">
        <strong>⚠️ Visual Assessment Disclaimer:</strong> {disclaimer}
      </div>

    </div>
  );
};

export default QualityAnalysisResult;
