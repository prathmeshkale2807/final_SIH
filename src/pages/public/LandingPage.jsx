import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { marketService } from '../../services/marketService';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, isFarmer, isBuyer } = useAuth();

  // Interactive Live Simulator on Landing Page
  const [simCrop, setSimCrop] = useState('onion');
  const [simQty, setSimQty] = useState(100);

  const cropRates = {
    onion: { name: 'Onion (कांदा)' },
    tomato: { name: 'Tomato (टोमॅटो)' },
    soybean: { name: 'Soybean (सोयाबीन)' },
    potato: { name: 'Potato (बटाटा)' },
  };

  // High-precision Multi-Channel Engine Calculation
  const simResults = marketService.calculateMultiChannelSimulator({
    cropKey: simCrop,
    quantityQuintals: simQty,
  });

  const {
    channel1_distantAPMC,
    channel2_directBuyer,
    channel3_localMandi,
    krishakHybridSplit,
    advice,
  } = simResults;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH CINEMATIC ATMOSPHERE & BALANCED LIVE INTELLIGENCE */}
      {/* ========================================================================= */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-100 border-b border-slate-200/70">

        {/* ATMOSPHERIC BACKGROUND LAYERS */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <img
            src="/farmer_hero_bg.jpg"
            alt="Indian agriculture at golden sunrise"
            className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.88] contrast-[1.06] saturate-[1.12]"
          />
          <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-transparent w-full lg:w-[68%]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-black/10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT HERO CONTENT */}
            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              {/* TOP PILL BADGE */}
              {isAuthenticated ? (
                <div className="inline-flex items-center space-x-2.5 bg-emerald-100/95 text-emerald-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-emerald-300 animate-fade-in-up">
                  <span className="live-dot"></span>
                  <span>
                    Welcome, {user?.name || user?.businessName || (isFarmer ? 'Rahul Jadhav' : 'AgroFresh')} •{' '}
                    {isFarmer ? '🌾 Verified Farmer' : isBuyer ? '🏪 Verified Buyer' : '⚙️ SuperAdmin'}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2.5 bg-white/95 backdrop-blur-md text-emerald-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-emerald-300/80 animate-fade-in-up">
                  <span className="live-dot"></span>
                  <span className="text-[#0F382C] font-extrabold">Next-Gen Agricultural Intelligence & Market Engine</span>
                </div>
              )}

              {/* HIGH-CONTRAST SOLID FOREST GREEN HEADLINE */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-900 leading-[1.06] animate-fade-in-up">
                Sell Smarter.<br />
                <span className="text-[#0F382C]">
                  Earn Maximum Profit.
                </span>
              </h1>

              {/* HIGH-READABILITY SUBTITLE WITH CONTRAST PROTECTION */}
              <p className="text-base sm:text-lg text-slate-800 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-semibold bg-white/30 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none p-1.5 lg:p-0 rounded-2xl animate-fade-in-up drop-shadow-xs">
                KRISHAK helps Indian farmers compare live market opportunities across APMCs and verified corporate buyers, forecast price trends, and calculate optimal multi-channel selling splits for guaranteed higher take-home payouts.
              </p>

              {/* STANDARDIZED PRIMARY & SECONDARY ACTION BUTTONS */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 animate-fade-in-up">
                {!isAuthenticated ? (
                  <>
                    {/* PRIMARY FILLED GREEN BUTTON */}
                    <button
                      onClick={() => navigate('/login/farmer')}
                      className="px-6 sm:px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm sm:text-base shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Start Selling (Farmer)</span>
                      <span className="text-emerald-200">→</span>
                    </button>

                    {/* SECONDARY OUTLINE/GHOST BUTTON */}
                    <button
                      onClick={() => navigate('/login/buyer')}
                      className="px-6 sm:px-7 py-3.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 hover:text-slate-900 rounded-xl font-semibold text-sm sm:text-base shadow-2xs transition-all flex items-center space-x-2 border border-slate-300 hover:border-slate-400 cursor-pointer"
                    >
                      <span>Buyer Procurement Desk</span>
                      <span className="text-slate-400">→</span>
                    </button>
                  </>
                ) : isFarmer ? (
                  <>
                    {/* AUTHENTICATED FARMER ACTIONS */}
                    <button
                      onClick={() => navigate('/farmer/dashboard')}
                      className="btn-shimmer px-6 sm:px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-black text-sm sm:text-base shadow-md shadow-emerald-600/25 transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>🌾 Open Farmer Dashboard</span>
                      <span className="text-emerald-200">→</span>
                    </button>

                    <button
                      onClick={() => navigate('/farmer/list-produce')}
                      className="px-6 sm:px-7 py-3.5 bg-white hover:bg-emerald-50 active:scale-[0.98] text-emerald-950 rounded-xl font-extrabold text-sm sm:text-base shadow-2xs transition-all flex items-center space-x-2 border border-emerald-300 hover:border-emerald-400 cursor-pointer"
                    >
                      <span>+ List New Harvest Lot</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* AUTHENTICATED BUYER ACTIONS */}
                    <button
                      onClick={() => navigate('/buyer/dashboard')}
                      className="btn-shimmer px-6 sm:px-7 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 text-white rounded-xl font-black text-sm sm:text-base shadow-md shadow-blue-700/25 transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>🏪 Open Buyer Dashboard</span>
                      <span className="text-blue-200">→</span>
                    </button>

                    <button
                      onClick={() => navigate('/buyer/post-requirement')}
                      className="px-6 sm:px-7 py-3.5 bg-white hover:bg-blue-50 active:scale-[0.98] text-blue-950 rounded-xl font-extrabold text-sm sm:text-base shadow-2xs transition-all flex items-center space-x-2 border border-blue-300 hover:border-blue-400 cursor-pointer"
                    >
                      <span>+ Post Sourcing Tender</span>
                    </button>
                  </>
                )}
              </div>

              {/* KEY HIGHLIGHT CHIPS */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-700 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>Real Mandi Feeds</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>Direct Buyers</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-emerald-600 font-black">✓</span>
                  <span>AI Profit Split</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start bg-white/85 backdrop-blur-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[#0F382C] font-black">★</span>
                  <span>Escrow Safe</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE INTERACTIVE PROFIT SIMULATOR (JUDGES INTERACTIVE TOOL) */}
      {/* ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-200/80 shadow-xl shadow-emerald-900/5 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span>⚡ Interactive Simulator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Test Your Harvest Profit Calculation Live
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Select a crop and quantity to instantly see why KRISHAK's multi-channel split beats conventional single-market selling.
              </p>
            </div>

            {/* CROP SELECTOR BUTTONS */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(cropRates).map((cKey) => (
                <button
                  key={cKey}
                  onClick={() => setSimCrop(cKey)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    simCrop === cKey
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cropRates[cKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY SLIDER */}
          <div className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
              <span>Harvest Volume:</span>
              <span className="text-base font-black text-emerald-800 font-mono">{simQty} Quintals ({simQty * 100} KG)</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={simQty}
              onChange={(e) => setSimQty(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
              <span>20 Quintals (Smallholder)</span>
              <span>250 Quintals (Medium Farm)</span>
              <span>500 Quintals (Bulk Aggregation)</span>
            </div>
          </div>

          {/* SIDE-BY-SIDE RESULT COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* OPTION 1: CONVENTIONAL SELLING */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{channel1_distantAPMC.name}</h3>
                  <p className="text-[11px] text-slate-500">100% Sold to Single Quoted Rate</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">Single Channel</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span>Gross Quoted Value (₹{channel1_distantAPMC.grossRatePerQuintal}/q):</span>
                  <span className="font-mono font-bold text-slate-900">₹{channel1_distantAPMC.grossTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Long-Distance Freight (-₹{channel1_distantAPMC.freightPerQuintal}/q):</span>
                  <span className="font-mono font-bold">-₹{channel1_distantAPMC.freightTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Mandi Cess & Labor (-₹{channel1_distantAPMC.cessPerQuintal}/q):</span>
                  <span className="font-mono font-bold">-₹{channel1_distantAPMC.cessTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Net Take-Home Cash:</span>
                <span className="text-xl font-black font-mono text-slate-900">₹{channel1_distantAPMC.netPayoutTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* OPTION 2: KRISHAK HYBRID SPLIT */}
            <div className="p-6 rounded-3xl bg-emerald-50/80 border-2 border-emerald-500 space-y-4 shadow-lg shadow-emerald-600/10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-emerald-950 text-sm flex items-center space-x-1.5">
                    <span>🏆 KRISHAK Split Optimizer</span>
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-medium">60% Farm-Gate Buyer + 40% Nearby APMC/FPO</p>
                </div>
                <span className="text-[10px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  MAX PROFIT
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 border-t border-emerald-200 pt-3">
                <div className="flex justify-between">
                  <span>60% Direct Buyer ({channel2_directBuyer.qty}Q @ ₹{channel2_directBuyer.ratePerQuintal}/q, Zero Freight):</span>
                  <span className="font-mono font-bold text-emerald-900">₹{channel2_directBuyer.netPayoutTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>40% Local APMC ({channel3_localMandi.qty}Q @ ₹{channel3_localMandi.ratePerQuintal}/q, Low Freight):</span>
                  <span className="font-mono font-bold text-emerald-900">₹{channel3_localMandi.netPayoutTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Price Forecast & Advice:</span>
                  <span className="font-mono font-bold text-emerald-800">{advice}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-300 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Net Farmer Take-Home:</span>
                  <span className="text-xl font-black font-mono text-emerald-900">₹{krishakHybridSplit.netTakeHomeCash.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-emerald-700 uppercase block">Extra Profit Earned</span>
                  <span className="text-lg font-black font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                    +₹{krishakHybridSplit.extraProfitEarned.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/farmer/best-deal')}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              Open Full Multi-Channel Optimization Engine →
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW KRISHAK WORKS SECTION */}
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
      {/* 4. WHY KRISHAK 6-FEATURE GRID */}
      {/* ========================================================================= */}
      <section id="why-krishak" className="py-20 bg-slate-100/70 border-t border-slate-200/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
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
              <h3 className="font-bold text-slate-900 text-lg">Real Market Intelligence</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live modal price feeds, arrival volumes, and demand indexes across major APMC market yards.
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
            <p className="mt-1">Smart agricultural intelligence & multi-channel marketplace platform.</p>
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

export default LandingPage;
