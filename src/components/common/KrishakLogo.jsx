import React, { useState } from 'react';

export const KrishakLogo = ({ size = 'normal', showTagline = true, variant = 'full' }) => {
  const [imgError, setImgError] = useState(false);
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  const isCompact = variant === 'compact';

  // BALANCED & EYE-CATCHING PROPORTIONS
  const iconSizes = isSmall
    ? 'h-9 w-9 p-1'
    : isLarge
    ? 'h-14 w-14 sm:h-16 sm:w-16 p-1.5'
    : 'h-11 w-11 sm:h-12 sm:w-12 p-1';

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
      {/* OFFICIAL KRISHAK WARRIOR ARCHER LOGO EMBLEM */}
      <div
        className={`relative flex-shrink-0 rounded-2xl bg-white text-emerald-900 shadow-md shadow-emerald-900/15 border-2 border-emerald-400/60 group-hover:scale-105 group-hover:shadow-emerald-600/30 group-hover:border-harvest-400/80 transition-all duration-300 flex items-center justify-center overflow-hidden ${iconSizes}`}
      >
        {!imgError ? (
          <img
            src="/krishak_logo.png"
            alt="Krishak Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-xs group-hover:rotate-1 transition-transform"
          />
        ) : (
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block drop-shadow-xs"
          >
            <circle cx="32" cy="28" r="20" fill="#FACC15" opacity="0.22" />
            <path
              d="M23 18C23 13.5 27 10 32 10C37 10 41 13.5 41 18C41 19.5 39.5 20.5 37.5 20.5H26.5C24.5 20.5 23 19.5 23 18Z"
              fill="#D97706"
            />
            <path
              d="M32 52C32 52 16 44 18 26C26 26 32 34 32 52Z"
              fill="#059669"
            />
            <path
              d="M32 52C32 52 48 44 46 26C38 26 32 34 32 52Z"
              fill="#34D399"
              opacity="0.92"
            />
            <path
              d="M32 18V54"
              stroke="#064E3B"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Ambient Hover Shimmer */}
        <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
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
            <span className="inline-block h-2 w-2 rounded-full bg-harvest-500 animate-pulse shadow-xs"></span>
          </div>
          {showTagline && (
            <span
              className={`${taglineSizes} font-black text-emerald-700 uppercase mt-1 leading-tight flex items-center gap-1`}
            >
              <span>WE LOVE MAXIMIZING PROFIT</span>
              <span className="text-harvest-600 font-bold">🌾</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const KrishkLogo = KrishakLogo;
export default KrishakLogo;
