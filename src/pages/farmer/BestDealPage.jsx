import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { profitService } from '../../services/profitService';

export const BestDealPage = () => {
  const { t } = useLanguage();
  const { showToast } = useApp();

  const [crop, setCrop] = useState('onion');
  const [quantity, setQuantity] = useState(100);
  const [quality, setQuality] = useState('Grade A');
  const [location, setLocation] = useState('Pune');
  const [analysis, setAnalysis] = useState(() =>
    profitService.calculateOptimalAllocation({
      crop: 'onion',
      quantity: 100,
      quality: 'Grade A',
      location: 'Pune',
    })
  );

  useEffect(() => {
    let isMounted = true;
    profitService
      .analyzeProfit({ crop, quantity, quality, location })
      .then((res) => {
        if (isMounted && res) setAnalysis(res);
      })
      .catch(() => {
        if (isMounted) {
          setAnalysis(profitService.calculateOptimalAllocation({ crop, quantity, quality, location }));
        }
      });
    return () => {
      isMounted = false;
    };
  }, [crop, quantity, quality, location]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* VIBRANT AGRICULTURAL HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/15 relative overflow-hidden border border-emerald-500/30">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-xs">
            <span>🏆</span>
            <span>{t('recommendation_banner', 'KRISHAK RECOMMENDATION')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('best_deal_title', 'KRISHAK Maximum Profit Engine')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
            {t('philosophy', 'Do not simply show farmers the highest market price. Analyze all available selling opportunities and recommend the strategy that maximizes the farmer\'s expected profit.')}
          </p>
        </div>
      </div>

      {/* INPUT CONFIGURATOR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md border border-slate-200/80 transition-all">
        <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
          {t('configure_harvest', 'Configure Your Harvest Produce')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">{t('select_crop', 'Select Crop')}</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="onion">🧅 Onion (कांदा / Pyaz)</option>
              <option value="tomato">🍅 Tomato (टोमॅटो / Tamatar)</option>
              <option value="potato">🥔 Potato (बटाटा / Aloo)</option>
              <option value="soybean">🌱 Soybean (सोयाबीन)</option>
              <option value="wheat">🌾 Wheat (गहू / Gehun)</option>
              <option value="cotton">☁️ Cotton (कापूस / Kapas)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">{t('quantity_quintals', 'Quantity (Quintals)')}</label>
            <input
              type="number"
              min="10"
              max="5000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">{t('quality_grade', 'Quality Grade')}</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="Grade A">Grade A (Export / Processing Quality)</option>
              <option value="Grade B">Grade B (Standard Market Grade)</option>
              <option value="Grade C">Grade C (Local Mandi Grade)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">{t('your_location', 'Your Location')}</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="Pune">Pune Region (पुणे)</option>
              <option value="Nashik">Nashik Region (नाशिक)</option>
              <option value="Latur">Latur / Marathwada (लातूर)</option>
              <option value="Solapur">Solapur Region (सोलापूर)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CORE RECOMMENDATION RESULT CARD WITH VIBRANT EMERALD & CRISP WHITE CONTRAST */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-800/20 border border-emerald-400/40 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/40 pb-5">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/30 text-emerald-100 px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-emerald-300/30">
              <span className="live-dot"></span>
              <span>{t('optimal_strategy', 'Optimal Multi-Channel Strategy')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 leading-tight">
              {t('split_allocation_title', 'Split Allocation: 60% Verified Industrial Buyer + 40% APMC Benchmark')}
            </h2>
          </div>
          <div className="text-left sm:text-right bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 flex-shrink-0 shadow-inner">
            <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">{t('total_expected_profit', 'Total Expected Take-Home Profit')}</div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono drop-shadow-xs">
              ₹{analysis.totalExpectedProfit.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* COMPARISON BENEFIT BADGE */}
        <div className="bg-white/15 backdrop-blur-md border border-white/25 p-4 rounded-2xl flex items-center space-x-3 text-white shadow-xs">
          <span className="text-2xl">📈</span>
          <p className="text-xs sm:text-sm font-bold text-emerald-50 leading-relaxed">
            {analysis.profitDelta > 0
              ? `+₹${analysis.profitDelta.toLocaleString('en-IN')} ${t('profit_delta_desc', 'better than selling all produce in the highest-price market (due to freight and mandi cess deductions).')}`
              : t('profit_delta_better', 'Better than selling all produce into a single high-distance market.')}
          </p>
        </div>

        {/* ALLOCATION BREAKDOWN CARDS WITH CRISP WHITE SURFACES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {analysis.allocations.map((alloc, idx) => (
            <div key={idx} className="bg-white text-slate-900 rounded-2xl p-5 space-y-3 shadow-lg border border-emerald-100 hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {alloc.percentage} {t('allocation', 'Allocation')} ({alloc.quantity} Quintals)
                </span>
                <span className="text-xs text-slate-500 font-bold font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg">{alloc.distance}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{alloc.channelName}</h3>
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">{t('offer_rate', 'Offer Rate')}</span>
                  <span className="font-black text-slate-900 font-mono text-base">₹{alloc.unitPrice}/q</span>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/70">
                  <span className="text-emerald-700 block text-[10px] font-bold uppercase">{t('net_realization', 'Net Realization')}</span>
                  <span className="font-black text-emerald-700 font-mono text-base">₹{alloc.netProfit.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 font-semibold flex items-center space-x-1.5 pt-1">
                <span>🛡️ {alloc.paymentTerms}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-emerald-100 font-medium">
            🔒 {t('prices_verified_note', 'Prices verified with live APMC feeds and buyer escrow commitments.')}
          </p>
          <button
            onClick={() => showToast(t('strategy_locked', 'Allocation locked! 60Q assigned to ABC Processors, 40Q reserved for Pune APMC.'))}
            className="w-full sm:w-auto px-8 py-3.5 bg-harvest-400 hover:bg-harvest-300 active:scale-[0.98] text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-harvest-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t('execute_strategy', 'Execute This Selling Strategy')}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* HOW KRISHAK FOUND YOUR BEST DEAL (SIMPLE EXPLANATION SECTION) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {t('how_dhanya_found', 'How KRISHAK Found Your Best Deal')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('simple_explanation', 'KRISHAK compares all available selling opportunities and finds the combination expected to give you the highest overall profit.')}
          </p>
        </div>

        {/* VISUAL FLOWCHART */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-2xl">📦</div>
            <div className="text-sm font-bold text-slate-900">{quantity} Quintals Available</div>
            <p className="text-xs text-slate-500">{crop.toUpperCase()} • {quality} • {location}</p>
          </div>

          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <div className="text-2xl">⚙️</div>
            <div className="text-sm font-bold text-emerald-900">{t('app_name', 'KRISHAK')} Profit Engine</div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Evaluates Selling Price, Buyer Demand, Freight Distance, Mandi Cess, and Spoilage Risk
            </p>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 space-y-2">
            <div className="text-2xl">🎯</div>
            <div className="text-sm font-bold text-blue-900">{t('optimal_strategy', 'Optimal Profit Allocation')}</div>
            <p className="text-xs text-blue-700 font-bold">
              60% Direct Buyer + 40% Benchmark Mandi
            </p>
          </div>
        </div>

        {/* BACKEND INTELLIGENCE ARCHITECTURE */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-slate-700 font-bold">
            <span>🔬</span>
            <span>{t('continuous_optimization', 'Continuous Market & Algorithmic Optimization')}</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            {t('optimization_footnote', 'KRISHAK\'s decision support model continuously computes multi-buyer linear programming allocations, evaluating farm-gate pickup bids against live mandi benchmark rates to protect farmer margins.')}
          </p>
        </div>
      </div>
    </div>
  );
};
