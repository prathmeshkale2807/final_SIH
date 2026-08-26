import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { marketService } from '../../services/marketService';

export const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [mandiRates, setMandiRates] = useState([
    { name: 'Pune APMC Market Yard', rate: '₹1,940/q', rawRate: 1940, net: '₹1,885/q Net', distance: '45 km', trend: '+5.1%', tag: 'Best Net' },
    { name: 'Lasalgaon APMC (Nashik)', rate: '₹1,820/q', rawRate: 1820, net: '₹1,745/q Net', distance: '85 km', trend: '+3.2%', tag: 'Largest Hub' },
    { name: 'Mumbai APMC (Vashi)', rate: '₹2,100/q', rawRate: 2100, net: '₹1,890/q Net', distance: '165 km', trend: '+1.8%', tag: 'High Nominal' },
    { name: 'Latur APMC', rate: '₹1,760/q', rawRate: 1760, net: '₹1,695/q Net', distance: '62 km', trend: '+2.4%', tag: 'Local Yard' }
  ]);

  useEffect(() => {
    marketService.getPrices({ crop: 'onion' }).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const top4 = data.slice(0, 4).map((m) => ({
          name: m.marketName || m.name,
          rate: `₹${(m.modalPricePerQuintal || 1820).toLocaleString('en-IN')}/q`,
          rawRate: m.modalPricePerQuintal || 1820,
          net: `₹${Math.round((m.modalPricePerQuintal || 1820) - 55).toLocaleString('en-IN')}/q Net`,
          distance: `${m.distanceKm || 50} km`,
          trend: '+4.2%',
          tag: m.district || 'Verified APMC',
        }));
        if (top4.length > 0) setMandiRates(top4);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
      
      {/* 1. WELCOME HERO WITH FARM WEATHER & BEST DEAL ACTION */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/15 border border-emerald-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30 shadow-xs">
              <span className="live-dot"></span>
              <span>{t('verified_farmer_portal', 'Verified Farmer Portal')}</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-900/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-emerald-100 font-mono font-semibold border border-white/10">
              <span>☀️ 29°C Sunny</span>
              <span>•</span>
              <span>Ausa, Latur</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t('good_morning', 'Good Morning')}, {user?.name || 'Rahul Jadhav'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
            {t('primary_crop_label', 'Primary Crop:')} <strong className="text-white font-black underline decoration-harvest-400 underline-offset-2">Onion (कांदा / Pyaz)</strong> • 8.5 Acres • 100 Quintals {t('ready_for_selling', 'Ready For Selling')}
          </p>
        </div>

        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto relative z-10">
          <button
            onClick={() => navigate('/farmer/best-deal')}
            className="btn-shimmer px-6 py-4 bg-harvest-400 hover:bg-harvest-300 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-harvest-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>🏆 {t('find_best_deal', 'Find My Best Selling Deal')}</span>
            <span>→</span>
          </button>
          <button
            onClick={() => navigate('/farmer/list-produce')}
            className="px-5 py-4 bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-sm rounded-2xl border border-white/30 backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t('list_new_harvest', '+ List New Harvest')}</span>
          </button>
        </div>
      </div>

      {/* 2. FOUR CORE INTELLIGENCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: TODAY'S APMC RATE */}
        <div className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-200 transition-all space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('today_market', "Today's APMC Rate")}</span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-md">AGMARKNET LIVE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {mandiRates[0]?.rate || '₹1,940/q'} <span className="text-xs font-bold text-emerald-600">+5.1% 📈</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Pune APMC Modal (Lasalgaon: ₹1,820/q)</p>
        </div>

        {/* KPI 2: AI FORECAST */}
        <div className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-200 transition-all space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('ai_forecast_tomorrow', 'Tomorrow AI Range')}</span>
            <span className="text-[10px] text-harvest-800 font-mono font-bold bg-harvest-100 px-2 py-0.5 rounded-md">AI PREDICT</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">₹1,850–₹1,950/q</div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
            <span>📈</span>
            <span>Upward Price Momentum (78% Conf)</span>
          </p>
        </div>

        {/* KPI 3: BEST BUYER OFFER */}
        <div className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-blue-200 transition-all space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{t('best_opportunity', 'Best Buyer Bid')}</span>
            <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-md">BUYER</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono">
            ₹1,850 <span className="text-xs text-slate-500 font-sans font-bold">/ q</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">AgroFresh Ltd. • 45 km Farm Gate Pickup</p>
        </div>

        {/* KPI 4: AI ACTION ADVICE */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 text-white p-5 rounded-3xl shadow-md shadow-emerald-700/20 border border-emerald-500/40 space-y-2">
          <div className="text-[11px] font-bold text-harvest-300 uppercase tracking-wider flex items-center justify-between">
            <span>{t('ai_recommendation', 'AI Recommendation')}</span>
            <span className="text-xs">🤖</span>
          </div>
          <div className="text-2xl font-black text-harvest-300">{t('wait_recommendation', 'WAIT 1 DAY ⏳')}</div>
          <p className="text-[11px] text-emerald-100 font-medium leading-tight">
            Supply arrivals drop 14% tomorrow in Nashik & Pune yards
          </p>
        </div>
      </div>

      {/* 3. ACTIVE HARVEST PRODUCE & MULTI-CHANNEL ACTION (FARMER'S CENTRAL WORKSPACE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase">
              <span>🌾 {t('active_harvest_lot', 'Active Harvest Lot')}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">
              100 Quintals Red Onion (Garwa Grade A)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Listed Lot ID: <span className="font-mono font-bold text-slate-700">LOT-2026-ON01</span> • Stored at Farm Shed, Ausa
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl text-xs font-black">
              <span className="live-dot"></span>
              <span>3 {t('bids_received', 'Verified Buyer Bids Received')}</span>
            </span>
          </div>
        </div>

        {/* HARVEST STRATEGY QUICK SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('single_market_payout', 'Single Market Payout')}</span>
            <div className="text-xl font-extrabold text-slate-800 font-mono">₹1,36,000</div>
            <p className="text-[11px] text-slate-500">If 100% sold at Pune APMC Yard</p>
          </div>

          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-1">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">{t('krishak_split_payout', 'KRISHAK Split Payout')}</span>
            <div className="text-xl font-black text-emerald-900 font-mono">₹1,38,700</div>
            <p className="text-[11px] text-emerald-700 font-semibold">+₹2,700 extra take-home profit</p>
          </div>

          <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 space-y-1">
            <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider block">{t('recommended_split', 'Recommended Split')}</span>
            <div className="text-base font-black text-blue-950">60Q Buyer + 40Q APMC</div>
            <p className="text-[11px] text-blue-700 font-semibold">Zero logistics stress on 60% harvest</p>
          </div>
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            💡 ABC Food Processors offered to pick up 60 Quintals directly from your farm gate.
          </div>
          <button
            onClick={() => navigate('/farmer/best-deal')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>{t('execute_split_allocation', 'Execute Split Allocation')}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* 4. LIVE NEARBY APMC MANDIS COMPARISON STRIP */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{t('regional_apmc_rates', 'Regional APMC Mandi Benchmark Rates')}</h3>
            <p className="text-xs text-slate-500">Live modal rate vs estimated net take-home realization</p>
          </div>
          <button
            onClick={() => navigate('/farmer/markets')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>{t('view_all_mandis', 'View All Mandis')}</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mandiRates.map((m, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/farmer/markets')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs group-hover:text-emerald-900">{m.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{m.trend}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-black text-slate-900 font-mono">{m.rate}</div>
                <div className="text-xs font-extrabold text-emerald-700 font-mono">{m.net}</div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 font-medium">
                <span>Distance: {m.distance}</span>
                <span className="text-slate-600 font-semibold">{m.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. FOUR LARGE, SIMPLE & TOUCH-FRIENDLY ACTION TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/farmer/best-deal')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2"
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🏆
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-emerald-900">Maximum Profit</div>
            <p className="text-xs text-slate-500 mt-0.5">Split channel optimizer for highest payout</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/farmer/markets')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2"
        >
          <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📊
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-emerald-900">APMC Mandis</div>
            <p className="text-xs text-slate-500 mt-0.5">Live prices, arrivals & 5-day trends</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/farmer/offers')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2"
        >
          <div className="h-12 w-12 rounded-2xl bg-harvest-100 text-harvest-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🤝
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-emerald-900">Buyer Bids</div>
            <p className="text-xs text-slate-500 mt-0.5">3 corporate buyers currently bidding</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/farmer/transactions')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2"
        >
          <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🛡️
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-emerald-900">Escrow Payouts</div>
            <p className="text-xs text-slate-500 mt-0.5">Guaranteed bank settlement tracking</p>
          </div>
        </button>
      </div>

    </div>
  );
};
