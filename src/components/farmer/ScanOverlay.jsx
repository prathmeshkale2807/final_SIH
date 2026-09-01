import React from 'react';

export const ScanOverlay = ({ isScanning = false, guidanceText = 'Keep produce centered inside the frame', detectedCount = 0 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      
      {/* ─── TOP STATUS BADGES ─── */}
      <div className="flex items-center justify-between gap-2">
        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <span className={`h-2 w-2 rounded-full ${isScanning ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="font-mono">{isScanning ? 'AI SCANNING IN PROGRESS' : 'VISION SENSOR READY'}</span>
        </div>

        {detectedCount > 0 && (
          <div className="bg-emerald-950/85 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <span>🎯</span>
            <span>{detectedCount} Units Tracked</span>
          </div>
        )}
      </div>

      {/* ─── CORNER VIEWFINDER BRACKETS ─── */}
      <div className="relative w-full h-[65%] my-auto flex items-center justify-center">
        {/* Top-Left Bracket */}
        <div className="absolute top-0 left-0 w-8 sm:w-12 h-8 sm:h-12 border-t-3 border-l-3 border-emerald-400 rounded-tl-xl shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
        {/* Top-Right Bracket */}
        <div className="absolute top-0 right-0 w-8 sm:w-12 h-8 sm:h-12 border-t-3 border-r-3 border-emerald-400 rounded-tr-xl shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
        {/* Bottom-Left Bracket */}
        <div className="absolute bottom-0 left-0 w-8 sm:w-12 h-8 sm:h-12 border-b-3 border-l-3 border-emerald-400 rounded-bl-xl shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
        {/* Bottom-Right Bracket */}
        <div className="absolute bottom-0 right-0 w-8 sm:w-12 h-8 sm:h-12 border-b-3 border-r-3 border-emerald-400 rounded-br-xl shadow-[0_0_10px_rgba(52,211,153,0.5)]" />

        {/* Center Crosshairs */}
        <div className="w-6 h-6 border-t border-b border-emerald-400/40 opacity-60 pointer-events-none" />
        <div className="h-6 w-6 border-l border-r border-emerald-400/40 opacity-60 pointer-events-none absolute" />

        {/* Moving Laser Scan Line */}
        {isScanning && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#10b981] animate-scan-laser" />
            <div className="absolute inset-0 bg-emerald-500/10 backdrop-brightness-110 animate-pulse" />
          </div>
        )}
      </div>

      {/* ─── BOTTOM GUIDANCE BANNER ─── */}
      <div className="flex justify-center">
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/90 text-slate-200 text-xs font-semibold px-4 py-2 rounded-2xl shadow-xl max-w-sm text-center">
          {guidanceText}
        </div>
      </div>

    </div>
  );
};

export default ScanOverlay;
