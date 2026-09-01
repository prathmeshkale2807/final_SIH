import React from 'react';

export const QualityAnalysisResult = ({
  result,
  onApplyRecommendation,
  onAddAnotherAngle,
  onReset,
}) => {
  if (!result || !result.qualityMetrics) return null;

  const {
    produceType = 'Tomato',
    produceIcon = '🍅',
    produceConfidence = 0.96,
    detectedCount = 12,
    qualityMetrics,
    overallScore = 91,
    gradeInfo,
    explanations = [],
    farmerGuidance,
    defects = [],
    multiAngleNote,
    additionalPhotosRecommended,
    recommendedAngle,
    imagesAnalyzedCount = 1,
    disclaimer,
  } = result;

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
                {Math.round(produceConfidence * 100)}% Identified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Identified {detectedCount} individual produce units in batch • {imagesAnalyzedCount} {imagesAnalyzedCount === 1 ? 'photo' : 'photos'} analyzed
            </p>
          </div>
        </div>

        {multiAngleNote && (
          <div className="bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium px-3 py-1.5 rounded-xl max-w-xs self-start sm:self-auto">
            {multiAngleNote}
          </div>
        )}
      </div>

      {/* ─── 2. QUALITY METRICS PROGRESS BARS ─── */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>📊</span>
            <span>AI Visual Quality Parameters</span>
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
            <span className="text-[10px] text-slate-400 block">Weight: 20% • Turgidity &amp; Calyx State</span>
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
              {defects.length === 0 ? 'Zero severe rot or deep cracks' : `${defects.length} minor surface spots`}
            </span>
          </div>

        </div>
      </div>

      {/* ─── 3. HERO SCORE & RECOMMENDATION CARD ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gradient-to-br from-[#062d1f] to-[#041a12] text-white p-5 sm:p-6 rounded-3xl border border-emerald-700/60 shadow-xl items-center">
        
        {/* Score Ring / Left (4 cols) */}
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
              AGMARKNET Standard Scale
            </span>
          </div>
        </div>

        {/* Grade Recommendation Center (5 cols) */}
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
          
          {additionalPhotosRecommended && (
            <button
              type="button"
              onClick={() => onAddAnotherAngle(recommendedAngle || 'side')}
              className="w-full py-1.5 text-[11px] text-amber-300 hover:text-white font-bold transition-colors text-center cursor-pointer"
            >
              📷 + Add {recommendedAngle === 'side' ? 'Side View' : 'Close-up'}
            </button>
          )}
        </div>

      </div>

      {/* ─── 4. "WHY THIS GRADE?" TRANSPARENT EXPLANATION ─── */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>💡</span>
          <span>Why this recommendation?</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          {explanations.map((exp, idx) => (
            <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-100 font-medium">
              {exp}
            </div>
          ))}
        </div>
      </div>

      {/* ─── 5. ACTIONABLE FARMER GUIDANCE ─── */}
      {farmerGuidance && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-medium leading-relaxed">
          <strong>🌾 Farmer Market Advisory:</strong> {farmerGuidance}
        </div>
      )}

      {/* ─── 6. EXPLICIT VISUAL SCANNER DISCLAIMER ─── */}
      <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-normal">
        <strong>⚠️ Visual Assessment Disclaimer:</strong> {disclaimer}
      </div>

    </div>
  );
};

export default QualityAnalysisResult;
