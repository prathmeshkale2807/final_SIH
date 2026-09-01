import React, { useState } from 'react';

export const DetectionOverlay = ({
  detections = [],
  defects = [],
  showDetections = true,
  showDefects = true,
}) => {
  const [selectedDefect, setSelectedDefect] = useState(null);

  if ((!showDetections || detections.length === 0) && (!showDefects || defects.length === 0)) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-sans">
      
      {/* ─── 1. REAL VISION BOUNDING BOXES ─── */}
      {showDetections &&
        detections.map((det) => {
          if (!det.boundingBox) return null;
          const { x, y, width, height } = det.boundingBox;
          const topPct = `${(y * 100).toFixed(1)}%`;
          const leftPct = `${(x * 100).toFixed(1)}%`;
          const widthPct = `${(width * 100).toFixed(1)}%`;
          const heightPct = `${(height * 100).toFixed(1)}%`;

          const label = det.commodity || det.label || 'Produce';
          const conf = det.confidence ? `${Math.round(det.confidence * 100)}%` : '';

          return (
            <div
              key={det.id || `${x}-${y}`}
              style={{
                top: topPct,
                left: leftPct,
                width: widthPct,
                height: heightPct,
              }}
              className="absolute border-2 border-emerald-400 rounded-lg bg-emerald-400/15 shadow-[0_0_10px_rgba(52,211,153,0.4)] animate-fade-in transition-all"
            >
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-300" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-300" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-300" />

              {/* Tag Label */}
              <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-1 whitespace-nowrap">
                <span>{label}</span>
                {conf && <span className="font-mono">{conf}</span>}
              </span>
            </div>
          );
        })}

      {/* ─── 2. REAL SURFACE DEFECT REGIONS ─── */}
      {showDefects &&
        defects.map((def) => {
          if (!def.region) return null;
          const { x, y, width, height } = def.region;
          const topPct = `${(y * 100).toFixed(1)}%`;
          const leftPct = `${(x * 100).toFixed(1)}%`;
          const widthPct = `${(width * 100).toFixed(1)}%`;
          const heightPct = `${(height * 100).toFixed(1)}%`;

          const isSelected = selectedDefect?.id === def.id;

          return (
            <div
              key={def.id || `${x}-${y}`}
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
              className={`absolute pointer-events-auto border-2 border-amber-400 bg-amber-400/25 rounded-md cursor-pointer transition-all ${
                isSelected ? 'ring-4 ring-amber-400/50 scale-105' : 'hover:scale-105'
              }`}
            >
              <span className="absolute -top-5 right-0 bg-amber-500 text-slate-950 text-[9px] font-black px-1 py-0.2 rounded shadow whitespace-nowrap">
                ⚠ {def.label || def.type || 'Defect'}
              </span>

              {/* Defect Popover */}
              {isSelected && (
                <div className="absolute top-full left-0 mt-1.5 bg-slate-950/95 text-white p-2.5 rounded-xl border border-amber-400 text-left text-[11px] shadow-2xl z-30 min-w-[180px] pointer-events-auto">
                  <div className="font-bold text-amber-300">{def.type} ({def.severity || 'Minor'})</div>
                  {def.description && <p className="text-slate-300 text-[10px] mt-0.5">{def.description}</p>}
                </div>
              )}
            </div>
          );
        })}

    </div>
  );
};

export default DetectionOverlay;
