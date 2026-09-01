import React, { useState } from 'react';

export const DetectionOverlay = ({
  detections = [],
  defects = [],
  showDetections = true,
  showDefects = true,
}) => {
  const [selectedDefect, setSelectedDefect] = useState(null);

  if (!showDetections && !showDefects) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-sans">
      
      {/* ─── 1. YOLO-STYLE OBJECT DETECTION BOUNDING BOXES ─── */}
      {showDetections &&
        detections.map((det) => {
          const { x, y, width, height } = det.boundingBox || { x: 0.1, y: 0.1, width: 0.2, height: 0.2 };
          const topPct = `${(y * 100).toFixed(1)}%`;
          const leftPct = `${(x * 100).toFixed(1)}%`;
          const widthPct = `${(width * 100).toFixed(1)}%`;
          const heightPct = `${(height * 100).toFixed(1)}%`;

          return (
            <div
              key={det.id}
              style={{
                top: topPct,
                left: leftPct,
                width: widthPct,
                height: heightPct,
              }}
              className="absolute border-2 border-emerald-400 rounded-lg bg-emerald-400/10 shadow-[0_0_8px_rgba(52,211,153,0.3)] animate-fade-in transition-all"
            >
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300" />

              {/* Tag Label */}
              <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-1 whitespace-nowrap">
                <span>{det.label}</span>
                <span className="font-mono">{Math.round(det.confidence * 100)}%</span>
              </span>
            </div>
          );
        })}

      {/* ─── 2. DETECTED SURFACE DEFECTS HIGHLIGHTS ─── */}
      {showDefects &&
        defects.map((def) => {
          const { x, y, width, height } = def.region || { x: 0.4, y: 0.4, width: 0.1, height: 0.1 };
          const topPct = `${(y * 100).toFixed(1)}%`;
          const leftPct = `${(x * 100).toFixed(1)}%`;
          const widthPct = `${(width * 100).toFixed(1)}%`;
          const heightPct = `${(height * 100).toFixed(1)}%`;

          const isSelected = selectedDefect?.id === def.id;

          return (
            <div
              key={def.id}
              style={{
                top: topPct,
                left: leftPct,
                width: widthPct,
                height: heightPct,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDefect(isSelected ? null : def);
              }}
              className={`absolute pointer-events-auto border-2 border-amber-400 bg-amber-400/20 rounded-md cursor-pointer transition-all ${
                isSelected ? 'ring-4 ring-amber-400/50 scale-105' : 'hover:scale-105'
              }`}
            >
              <span className="absolute -top-5 right-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1 py-0.2 rounded shadow whitespace-nowrap">
                ⚠ {def.label}
              </span>

              {/* Defect Popover */}
              {isSelected && (
                <div className="absolute top-full left-0 mt-1.5 bg-slate-950/95 text-white p-2.5 rounded-xl border border-amber-400 text-left text-[11px] shadow-2xl z-30 min-w-[180px] pointer-events-auto">
                  <div className="font-bold text-amber-300">{def.type} ({def.severity})</div>
                  <p className="text-slate-300 text-[10px] mt-0.5">{def.description}</p>
                  <div className="text-[9px] text-slate-400 mt-1 font-mono">Confidence: {Math.round(def.confidence * 100)}%</div>
                </div>
              )}
            </div>
          );
        })}

    </div>
  );
};

export default DetectionOverlay;
