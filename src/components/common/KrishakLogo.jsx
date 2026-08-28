import React, { useState } from 'react';

export const KrishakLogo = ({ size = 'normal', showTagline = true, variant = 'full' }) => {
  const [imgError, setImgError] = useState(false);
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  const isCompact = variant === 'compact';

  // PROPORTIONAL SQUARE-ROUNDED BADGE SIZES
  const iconSizes = isSmall
    ? 'h-9 w-9 rounded-xl p-0.5'
    : isLarge
    ? 'h-16 w-16 sm:h-20 sm:w-20 rounded-3xl p-2'
    : 'h-11 w-11 sm:h-12 sm:w-12 rounded-2xl p-1';

  const titleSizes = isSmall
    ? 'text-lg sm:text-xl'
    : isLarge
    ? 'text-3xl sm:text-4xl'
    : 'text-2xl sm:text-[26px]';

  const taglineSizes = isSmall
    ? 'text-[8px] tracking-wider'
    : isLarge
    ? 'text-[11px] sm:text-xs tracking-wider'
    : 'text-[9.5px] sm:text-[10px] tracking-wide';

  return (
    <div className="group inline-flex items-center space-x-3 sm:space-x-3.5 select-none cursor-pointer">
      {/* SQUARE LOGO WITH CURVED EDGES */}
      <div
        className={`relative flex-shrink-0 bg-white text-emerald-900 shadow-md shadow-emerald-900/15 border-2 border-emerald-500/70 group-hover:scale-105 group-hover:shadow-emerald-600/30 group-hover:border-emerald-400 transition-all duration-300 flex items-center justify-center overflow-hidden ${iconSizes}`}
      >
        {!imgError ? (
          <img
            src="/krishak_logo.png"
            alt="Krishak Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-xs"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-700 text-white font-black text-lg">
            🌾
          </div>
        )}

        {/* Ambient Hover Shimmer */}
        <div className="absolute inset-0 bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>

      {/* BRAND WORDMARK */}
      {!isCompact && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span
              className={`font-display font-black tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors leading-none ${titleSizes}`}
            >
              KRISHAK
            </span>
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-xs"></span>
          </div>
          {showTagline && (
            <span
              className={`${taglineSizes} font-black text-emerald-700 uppercase mt-1 leading-tight flex items-center gap-1`}
            >
              <span>WE LOVE MAXIMIZING PROFIT</span>
              <span className="text-amber-500 font-bold">🌾</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const KrishkLogo = KrishakLogo;
export default KrishakLogo;
