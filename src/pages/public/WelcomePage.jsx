import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-emerald-50 via-slate-50 to-slate-100 px-4 py-8 sm:py-12">
      {/* HEADER LOGO */}
      <div className="max-w-md mx-auto w-full text-center space-y-3">
        <div className="inline-flex h-16 w-16 bg-gradient-to-tr from-emerald-700 to-emerald-500 rounded-3xl items-center justify-center text-white shadow-xl shadow-emerald-600/30 text-3xl">
          🌾
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {t('app_name', 'KRISHAK')}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-widest mt-1">
            {t('tagline', 'WE LOVE MAXIMIZING PROFIT.')}
          </p>
        </div>
      </div>

      {/* CORE ENTRY CARD */}
      <div className="max-w-md mx-auto w-full bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 space-y-6 my-6">
        {/* LANGUAGE SELECTION */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
            {t('select_language', 'Select your language')}
          </label>
          <div className="flex justify-center">
            <LanguageSwitcher variant="pills" />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h2 className="text-center text-sm font-extrabold uppercase tracking-wider text-slate-400">
            {t('continue_as', 'How would you like to continue?')}
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/login/farmer')}
              className="w-full py-4 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-600/25 flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌾</span>
                <div className="text-left">
                  <div>{t('continue_as_farmer', '🌾 Continue as Farmer')}</div>
                  <div className="text-[11px] font-normal text-emerald-100">Sell produce at maximum profit</div>
                </div>
              </div>
              <span className="text-xl font-bold">→</span>
            </button>

            <button
              onClick={() => navigate('/login/buyer')}
              className="w-full py-4 px-5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-2xl font-black text-base shadow-md flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏪</span>
                <div className="text-left">
                  <div>{t('continue_as_buyer', '🏪 Continue as Buyer')}</div>
                  <div className="text-[11px] font-normal text-slate-300">Procure lots directly from farmers</div>
                </div>
              </div>
              <span className="text-xl font-bold">→</span>
            </button>
          </div>
        </div>

        {/* PUBLIC DEMO LINK */}
        <div className="pt-2 text-center">
          <button
            onClick={() => navigate('/landing')}
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            {t('explore_platform', 'Explore Market Intelligence & Landing Page')} →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-md mx-auto w-full text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-600">KRISHAK</p>
        <p className="mt-0.5">Empowering farmers with multi-channel profit optimization</p>
      </div>
    </div>
  );
};
