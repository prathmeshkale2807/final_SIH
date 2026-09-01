import React from 'react';

export const AnalysisProgress = ({ currentStepIndex = -1, isScanning = false, isCompleted = false }) => {
  const PIPELINE_STEPS = [
    { title: 'Photo Quality & Illumination Check', desc: 'Validating daylight exposure, sharpness & produce framing' },
    { title: 'Identify Crop Commodity', desc: 'Confirming botanical class, variety and color signature' },
    { title: 'Detect Individual Produce Units', desc: 'Running YOLO-style bounding box isolation' },
    { title: 'Analyze Skin Color & Ripeness', desc: 'Measuring chlorophyll degradation and hue saturation' },
    { title: 'Check Size & Shape Uniformity', desc: 'Calculating sphericity ratios and diameter standard deviation' },
    { title: 'Scan for Visible Surface Defects', desc: 'Inspecting for abrasions, punctures, scarring and spots' },
    { title: 'Estimate Calyx & Skin Visual Freshness', desc: 'Evaluating skin turgidity and surface luster' },
    { title: 'Calculate AGMARKNET Quality Score', desc: 'Applying multi-factor weighted quality grading algorithm' },
  ];

  return (
    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚙️</span>
          <span>Computer Vision Pipeline</span>
        </h3>
        {isScanning && (
          <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Step {Math.min(PIPELINE_STEPS.length, currentStepIndex + 1)} of {PIPELINE_STEPS.length}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {PIPELINE_STEPS.map((step, idx) => {
          const isDone = currentStepIndex > idx || isCompleted;
          const isActive = isScanning && currentStepIndex === idx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-950 shadow-2xs'
                  : isDone
                  ? 'text-slate-800'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {/* Step Status Icon / Number */}
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <span className="h-4 w-4 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    ✓
                  </span>
                ) : isActive ? (
                  <span className="h-4 w-4 rounded-full bg-emerald-400 animate-ping flex items-center justify-center" />
                ) : (
                  <span className="h-4 w-4 rounded-full bg-slate-200 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Step Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold truncate">{step.title}</span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-emerald-600 font-extrabold animate-pulse bg-emerald-100/80 px-1.5 py-0.2 rounded">
                      ● Processing...
                    </span>
                  )}
                </div>
                {isActive && (
                  <p className="text-[10px] text-emerald-700 font-medium leading-tight mt-0.5">
                    {step.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisProgress;
