import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher = ({ variant = 'default' }) => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  if (variant === 'pills') {
    return (
      <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
        {availableLanguages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              language === l.code
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            {l.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <div className="relative flex items-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Select Language"
          className="appearance-none bg-slate-100/90 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200/80 text-slate-800 hover:text-emerald-900 text-xs font-bold rounded-xl pl-8 pr-7 py-2 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:outline-none transition-all duration-200 cursor-pointer shadow-sm"
        >
          {availableLanguages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native} ({l.code.toUpperCase()})
            </option>
          ))}
        </select>
        
        {/* Left Globe Icon */}
        <span className="absolute left-2.5 pointer-events-none text-slate-500 text-xs">
          🌐
        </span>

        {/* Right Caret Icon */}
        <i className="ri-arrow-down-s-line absolute right-2 pointer-events-none text-slate-400 text-xs"></i>
      </div>
    </div>
  );
};
