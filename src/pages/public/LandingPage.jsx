import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH CINEMATIC BACKGROUND & FLOATING METRIC BADGES */}
      {/* ========================================================================= */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/70 via-slate-50 to-slate-100 border-b border-slate-200/70">

        {/* BACKGROUND IMAGE & ATMOSPHERIC BLEND LAYERS */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <img
            src="/farmer_hero_bg.jpg"
            alt="Indian farmer in lush farm field at golden sunrise"
            className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.88] contrast-[1.06] saturate-[1.12]"
          />
          <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-transparent w-full lg:w-[68%]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-black/10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl lg:max-w-3xl space-y-6 text-center lg:text-left">
            {/* TOP PILL BADGE */}
            <div className="inline-flex items-center space-x-2.5 bg-white/95 backdrop-blur-md text-emerald-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-emerald-300/80 animate-fade-in-up">
              <span className="live-dot"></span>
              <span className="text-emerald-800 font-extrabold">{t('hero_badge', 'Next-Gen Agricultural Intelligence & Market Engine')}</span>
            </div>

            {/* HEADLINE WITH SHIMMER GRADIENT */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-900 leading-[1.06] animate-fade-in-up">
              {t('hero_title_1', 'Sell Smarter.')}<br />
              <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-harvest-600 bg-clip-text text-transparent">
                {t('hero_title_2', 'Earn Maximum Profit.')}
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium animate-fade-in-up">
              {t('hero_sub', 'KRISHAK helps Indian farmers compare market opportunities across APMCs and verified corporate buyers, forecast seasonal price trajectories, and calculate multi-channel selling splits for the highest take-home payout.')}
            </p>

            {/* PRIMARY CTAS */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2 animate-fade-in-up">
              <button
                onClick={() => navigate('/login/farmer')}
                className="btn-shimmer group px-7 sm:px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.98] text-white rounded-2xl font-black text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all flex items-center space-x-3 cursor-pointer"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🌾</span>
                <span>{t('start_selling', 'Start Selling (Free)')}</span>
                <span className="text-lg text-harvest-300 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={() => navigate('/login/buyer')}
                className="group px-7 sm:px-8 py-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-2xl font-black text-base shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all flex items-center space-x-3 border border-slate-800 cursor-pointer"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🏪</span>
                <span>{t('i_want_to_buy', 'Buyer Sourcing Hub')}</span>
                <span className="text-lg text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* TRUST VALUE BADGES */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-700 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <span className="text-emerald-600 font-black">✓</span>
                <span>Compare Mandis</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <span className="text-emerald-600 font-black">✓</span>
                <span>Direct Buyers</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <span className="text-emerald-600 font-black">✓</span>
                <span>AI Price Trends</span>
              </div>
              <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-slate-200/70 shadow-2xs">
                <span className="text-harvest-600 font-black">★</span>
                <span>Max Net Profit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOW KRISHAK WORKS SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider border border-emerald-200/80">
            <span>⚡ 4 High-Efficiency Steps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            How KRISHAK Delivers Value
          </h2>
          <p className="text-sm text-slate-500">
            From listing produce to optimal profit allocation and direct escrow settlement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100/90 text-emerald-800 text-2xl flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              🌾
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Step 01</span>
              <h3 className="font-bold text-slate-900 text-lg">List Your Produce</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add crop details, quantity (KG/Quintal/Ton), quality grade, farm location, and your target price in seconds.
              </p>
            </div>
          </div>

          <div className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100/90 text-emerald-800 text-2xl flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              📊
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Step 02</span>
              <h3 className="font-bold text-slate-900 text-lg">Compare Opportunities</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                KRISHAK compares nearby verified corporate buyers, regional APMC mandis, and direct processing tenders.
              </p>
            </div>
          </div>

          <div className="group bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100/90 text-emerald-800 text-2xl flex items-center justify-center font-bold shadow-inner group-hover:scale-110 transition-transform">
              🤖
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">Step 03</span>
              <h3 className="font-bold text-slate-900 text-lg">Understand Price Trends</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Analyze seasonal demand shifts, mandi arrival drops, and AI-predicted price trajectories before selling.
              </p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl hover:shadow-2xl hover:border-emerald-400 border border-emerald-800/60 transition-all duration-300 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-harvest-500 to-harvest-400 text-slate-950 text-2xl flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
              🏆
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-black text-harvest-300 uppercase tracking-wider">Step 04 • Highest Payout</span>
              <h3 className="font-bold text-white text-lg">Find Your Best Deal</h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Discover the multi-buyer split allocation strategy calculated to deliver the highest net profit to your bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE MARKET INTELLIGENCE SECTION */}
      {/* ========================================================================= */}
      <section id="market-intelligence" className="py-20 bg-slate-100/80 border-y border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-emerald-800 font-bold tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/80">
                <span className="live-dot"></span>
                <span>Real-Time APMC Feeds</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                Know What Your Crop Is Worth Today
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                Real-time modal rates, arrival volumes, and daily price momentum across regional APMC yards.
              </p>
            </div>
            <button
              onClick={() => navigate('/login/farmer')}
              className="self-start md:self-auto px-6 py-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center space-x-2"
            >
              <span>Explore All Mandis</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-xs hover:shadow-xl border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Nashik APMC</span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">↑ 5.2% Today</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Onion (Nashik Red)</h3>
                <div className="text-3xl font-black font-mono text-slate-900 mt-1">₹18.40 <span className="text-xs font-bold text-slate-500">/ KG</span></div>
              </div>
              <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 flex justify-between">
                <span>Arrivals: <strong>2,800 Quintals</strong></span>
                <span>Demand: <strong className="text-emerald-700 font-bold">Very High 🔥</strong></span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xs hover:shadow-xl border border-slate-200/80 hover:border-rose-300 transition-all duration-300 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Pune APMC</span>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">↓ 2.4% Today</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Tomato (Hybrid)</h3>
                <div className="text-3xl font-black font-mono text-slate-900 mt-1">₹32.10 <span className="text-xs font-bold text-slate-500">/ KG</span></div>
              </div>
              <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 flex justify-between">
                <span>Arrivals: <strong>1,450 Quintals</strong></span>
                <span>Demand: <strong className="text-slate-700 font-bold">Moderate</strong></span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xs hover:shadow-xl border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Mumbai APMC (Vashi)</span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">↑ 1.8% Today</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Potato (Jyoti)</h3>
                <div className="text-3xl font-black font-mono text-slate-900 mt-1">₹24.50 <span className="text-xs font-bold text-slate-500">/ KG</span></div>
              </div>
              <div className="text-xs text-slate-500 pt-3 border-t border-slate-100 flex justify-between">
                <span>Arrivals: <strong>3,200 Quintals</strong></span>
                <span>Demand: <strong className="text-emerald-700 font-bold">Steady</strong></span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. AI PRICE INSIGHT & PREDICTIVE INTELLIGENCE */}
      {/* ========================================================================= */}
      <section id="ai-insights" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-emerald-500/40 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-emerald-950 font-black tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                <span>🤖 Predictive Machine Intelligence</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight">
                Don't Just See Today's Price.<br />
                <span className="bg-gradient-to-r from-emerald-200 via-harvest-300 to-harvest-400 bg-clip-text text-transparent">
                  Know When It's Best To Sell.
                </span>
              </h2>
              <p className="text-sm text-emerald-50 leading-relaxed font-medium">
                KRISHAK analyzes multi-year historical mandi cycles, regional rainfall indicators, daily supply arrival drops, and corporate procurement demand to forecast 7-day and 30-day price trajectories.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-100 font-mono">
                <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">• 7-Day & 30-Day Windows</span>
                <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">• 78% Confidence Score</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white/95 text-slate-900 p-5 sm:p-7 rounded-2xl border border-white/40 space-y-5 shadow-2xl backdrop-blur-md">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-700">Onion Price Trend (Nashik Yard)</span>
                <span className="text-emerald-800 font-bold font-mono bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                  📈 Rising Momentum
                </span>
              </div>

              {/* SIMPLIFIED ASCENT CHART VISUALIZER */}
              <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200">
                <div className="w-full bg-slate-200 rounded-t h-[40%] text-center text-[10px] text-slate-600 font-bold pb-1">₹14</div>
                <div className="w-full bg-slate-200 rounded-t h-[50%] text-center text-[10px] text-slate-600 font-bold pb-1">₹15.5</div>
                <div className="w-full bg-slate-300 rounded-t h-[65%] text-center text-[10px] text-slate-700 font-bold pb-1">₹16.8</div>
                <div className="w-full bg-emerald-600 rounded-t h-[80%] text-center text-[10px] text-white font-bold pb-1 shadow-sm">₹18.4</div>
                <div className="w-full bg-harvest-400 border border-harvest-500 rounded-t h-[95%] text-center text-[10px] text-slate-950 font-black pb-1 shadow-xs">₹21.0</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] font-semibold">Current Spot Rate</span>
                  <span className="text-xl font-black font-mono text-slate-900">₹18.40 / KG</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200/80">
                  <span className="text-emerald-700 block text-[11px] font-bold">AI Forecast (Next 7D)</span>
                  <span className="text-xl font-black font-mono text-emerald-800">₹19 – ₹22 / KG</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MAXIMUM PROFIT CONCEPT */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase text-emerald-800 font-bold tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Core Economic Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Highest Price ≠ Highest Profit
            </h2>
            <p className="text-sm text-slate-500">
              A high distant selling price often results in lower take-home income once long-distance freight, spoilage, and mandi deductions are subtracted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* OPTION A */}
            <div className="p-7 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-base text-slate-700">Option A: Mumbai APMC</h3>
                <span className="text-xs font-bold text-slate-500">Distant High Rate</span>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">₹20.00 <span className="text-xs font-bold text-slate-400">/ KG</span></div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between"><span>Nominal Selling Price:</span><span className="font-mono font-bold">₹20.00 / KG</span></div>
                <div className="flex justify-between text-rose-600"><span>Transport & Long Freight:</span><span className="font-mono">-₹2.00 / KG</span></div>
                <div className="flex justify-between text-rose-600"><span>Mandi Cess & Unloading:</span><span className="font-mono">-₹0.50 / KG</span></div>
              </div>

              <div className="pt-3 border-t border-slate-300 flex justify-between items-center font-bold">
                <span className="text-xs text-slate-700">Net Farmer Take-Home:</span>
                <span className="text-xl font-black text-slate-800 font-mono">₹17.50 / KG</span>
              </div>
            </div>

            {/* OPTION B */}
            <div className="p-7 rounded-3xl bg-emerald-50/70 border-2 border-emerald-500 space-y-4 shadow-lg shadow-emerald-500/10">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-base text-emerald-950">Option B: Nearby Verified Buyer</h3>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">🏆 MAXIMUM PROFIT</span>
              </div>
              <div className="text-3xl font-black text-emerald-950 font-mono">₹19.00 <span className="text-xs font-bold text-emerald-700">/ KG</span></div>

              <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-emerald-200">
                <div className="flex justify-between"><span>Direct Buyer Price:</span><span className="font-mono font-bold">₹19.00 / KG</span></div>
                <div className="flex justify-between text-emerald-700 font-bold"><span>Transport (Farm Gate Pickup):</span><span className="font-mono">-₹0.40 / KG</span></div>
                <div className="flex justify-between text-emerald-700 font-bold"><span>Mandi Cess & Deductions:</span><span className="font-mono">-₹0.00</span></div>
              </div>

              <div className="pt-3 border-t border-emerald-300 flex justify-between items-center font-bold">
                <span className="text-xs text-emerald-950">Net Farmer Take-Home:</span>
                <span className="text-xl font-black text-emerald-800 font-mono">₹18.60 / KG (+₹1.10/KG Extra)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY KRISHAK 6-FEATURE GRID */}
      {/* ========================================================================= */}
      <section id="why-krishak" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase text-emerald-700 font-bold tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Engineered For Agriculture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Why Farmers & Buyers Choose KRISHAK
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
            <div className="text-3xl">🌾</div>
            <h3 className="font-bold text-slate-900 text-lg">Instant Produce Listings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              List crop variety, quantity, quality grade, target price, and farm gate GPS location in under 2 minutes.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
            <div className="text-3xl">📍</div>
            <h3 className="font-bold text-slate-900 text-lg">Geo-Spatial Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmic discovery connecting farmers directly with nearby food processors, wholesale chains, and exporters.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
            <div className="text-3xl">📊</div>
            <h3 className="font-bold text-slate-900 text-lg">Market Intelligence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Live modal price feeds, historical charts, arrival volumes, and demand indexes across major APMC yards.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
            <div className="text-3xl">🤖</div>
            <h3 className="font-bold text-slate-900 text-lg">AI Price Forecasting</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand historical and seasonal trends to know whether to sell today or wait for predicted rate jumps.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
            <div className="text-3xl">🛡️</div>
            <h3 className="font-bold text-slate-900 text-lg">7-Step Escrow Payouts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Protected transactions with upfront buyer deposits, weight verification, and instantaneous bank settlements.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all space-y-3">
            <div className="text-3xl">🏆</div>
            <h3 className="font-bold text-slate-900 text-lg">Maximum Take-Home</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculate optimal multi-channel selling splits ensuring you pocket the highest net profits on every harvest.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-12 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <div className="text-xl font-display font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>🌾 KRISHAK</span>
            </div>
            <p className="mt-1">Smart agricultural intelligence & multi-channel marketplace.</p>
          </div>
          <div className="text-xs text-slate-400 text-center sm:text-right">
            <p className="font-bold text-harvest-400 uppercase tracking-wider">WE LOVE MAXIMIZING PROFIT.</p>
            <p className="mt-0.5">Empowering Indian farmers with price transparency & profit optimization.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};
