import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AdvisoryInsightsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Advisory &amp; Profit Insights</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Machine learning market intelligence to maximize your take-home farm income.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Insight 1: Split Strategy */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg">⚖️</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Channel Split Profit Optimization</h3>
              <span className="text-xs text-emerald-700 font-bold">+₹2,700 Extra Realization</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Instead of selling 100% of your Nashik Red Onion harvest at Pune APMC (where transport and mandi cesses take ₹10,800), allocate 60% to AgroFresh Processors for farm-gate collection and 40% to Pune APMC for peak modal rate capture.
          </p>

          <button
            onClick={() => navigate('/farmer/best-deal')}
            className="w-full py-2.5 bg-[#008253] hover:bg-[#007047] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Launch Profit Simulator →
          </button>
        </div>

        {/* Insight 2: Harvest Timing */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg">⏳</span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">72-Hour Harvest Hold Advisory</h3>
              <span className="text-xs text-amber-800 font-bold">+₹80/q Expected Price Spike</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Mandi arrival inflow will contract by 14% across Lasalgaon and Pune tomorrow due to regional temple celebrations. Holding onion in your ventilated shed for 48 hours will increase take-home realization.
          </p>

          <button
            onClick={() => navigate('/farmer/markets')}
            className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            View APMC Inflow Trends →
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdvisoryInsightsPage;
