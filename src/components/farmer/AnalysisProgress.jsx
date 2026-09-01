import React from 'react';

export const AnalysisProgress = ({ currentStage = -1, stageStatuses = ['pending', 'pending', 'pending'], isScanning = false, isCompleted = false }) => {
  const PIPELINE_STAGES = [
    {
      title: 'Stage 1: Verifying Crop Identity',
      desc: 'Confirming the selected crop is actually visible in the image',
      icon: '🔍',
    },
    {
      title: 'Stage 2: Grading Quality',
      desc: 'Evaluating color, freshness, surface condition, and defects',
      icon: '📊',
    },
    {
      title: 'Stage 3: Estimating Quantity',
      desc: 'Counting units, estimating size and weight range',
      icon: '📦',
    },
  ];

  return (
    <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚙️</span>
          <span>AI Vision Pipeline</span>
        </h3>
        {isScanning && (
          <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Stage {Math.min(PIPELINE_STAGES.length, currentStage + 1)} of {PIPELINE_STAGES.length}
          </span>
        )}
        {isCompleted && !isScanning && (
          <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ✓ Complete
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = stageStatuses[idx] || 'pending';
          const isDone = status === 'done';
          const isActive = status === 'active' || (isScanning && currentStage === idx);
          const isFailed = status === 'failed';

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-950 shadow-2xs'
                  : isFailed
                  ? 'bg-red-50/80 border border-red-200 text-red-900'
                  : isDone
                  ? 'bg-emerald-50/40 text-slate-800'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {/* Step Status Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <span className="h-5 w-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    ✓
                  </span>
                ) : isFailed ? (
                  <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    ✕
                  </span>
                ) : isActive ? (
                  <span className="h-5 w-5 rounded-full bg-emerald-400 flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  </span>
                ) : (
                  <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Step Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold truncate flex items-center gap-1.5">
                    <span>{stage.icon}</span>
                    <span>{stage.title}</span>
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-emerald-600 font-extrabold animate-pulse bg-emerald-100/80 px-1.5 py-0.5 rounded flex-shrink-0">
                      ● Processing...
                    </span>
                  )}
                  {isFailed && (
                    <span className="text-[10px] font-mono text-red-600 font-extrabold bg-red-100/80 px-1.5 py-0.5 rounded flex-shrink-0">
                      ● Failed
                    </span>
                  )}
                </div>
                {(isActive || isDone || isFailed) && (
                  <p className={`text-[10px] font-medium leading-tight mt-0.5 ${
                    isFailed ? 'text-red-600' : isActive ? 'text-emerald-700' : 'text-slate-500'
                  }`}>
                    {stage.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gemini Attribution */}
      <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100 font-medium">
        Powered by Google Gemini Vision AI
      </div>
    </div>
  );
};

export default AnalysisProgress;
