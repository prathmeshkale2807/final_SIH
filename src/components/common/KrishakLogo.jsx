import React from 'react';

export const KrishakLogo = ({ size = 'normal', showTagline = true, variant = 'full' }) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  const isCompact = variant === 'compact';

  // BALANCED & EYE-CATCHING PROPORTIONS
  const iconSizes = isSmall
    ? 'h-9 w-9 p-1.5'
    : isLarge
    ? 'h-14 w-14 sm:h-16 sm:w-16 p-2.5'
    : 'h-11 w-11 sm:h-12 sm:w-12 p-2';

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
      {/* CREATIVE ICON EMBLEM: MODERN GOLDEN HARVEST & AGRI-TECH BRIDGE */}
      <div
        className={`relative flex-shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-950 via-emerald-800 to-emerald-600 text-white shadow-lg shadow-emerald-900/25 border border-emerald-400/40 group-hover:scale-105 group-hover:shadow-emerald-600/40 group-hover:border-harvest-400/70 transition-all duration-300 flex items-center justify-center ${iconSizes}`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block drop-shadow-xs"
        >
          <defs>
            {/* Rich Golden Sun Gradient */}
            <linearGradient id="krishakGold" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.4" stopColor="#FACC15" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>

            {/* Vibrant Emerald Leaf Gradient */}
            <linearGradient id="krishakGreen" x1="16" y1="56" x2="48" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="0.5" stopColor="#10B981" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Golden Sunrise Halo Background */}
          <circle cx="32" cy="28" r="20" fill="url(#krishakGold)" opacity="0.22" />

          {/* Golden Pagdi / Turban Arc Accent */}
          <path
            d="M23 18C23 13.5 27 10 32 10C37 10 41 13.5 41 18C41 19.5 39.5 20.5 37.5 20.5H26.5C24.5 20.5 23 19.5 23 18Z"
            fill="url(#krishakGold)"
          />
          <circle cx="32" cy="24" r="5" fill="#FEF08A" />

          {/* Stylized Twin Crop Leaves / Arching Bridge (Setu) */}
          <path
            d="M32 52C32 52 16 44 18 26C26 26 32 34 32 52Z"
            fill="url(#krishakGreen)"
          />
          <path
            d="M32 52C32 52 48 44 46 26C38 26 32 34 32 52Z"
            fill="#34D399"
            opacity="0.92"
          />

          {/* Central Golden Wheat Spine / Direct Growth Line */}
          <path
            d="M32 18V54"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Flourishing Grain Chevrons */}
          <path
            d="M24 38C28 35 36 35 40 38"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M26 46C29 44 35 44 38 46"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Golden Profit Star Sparkle */}
          <polygon
            points="32,6 33.5,9.5 37,11 33.5,12.5 32,16 30.5,12.5 27,11 30.5,9.5"
            fill="#FEF08A"
          />
        </svg>

        {/* Ambient Hover Shimmer */}
        <div className="absolute inset-0 rounded-2xl bg-emerald-300/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
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
