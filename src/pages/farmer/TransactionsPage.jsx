import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dealService } from '../../services/dealService';

export const TransactionsPage = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState(() => dealService.getFarmerDeals(user?.id));

  const refreshDeals = () => {
    setDeals([...dealService.getFarmerDeals(user?.id)]);
  };

  useEffect(() => {
    refreshDeals();
    const handleUpdate = () => refreshDeals();
    window.addEventListener('krishak_deals_updated', handleUpdate);
    return () => window.removeEventListener('krishak_deals_updated', handleUpdate);
  }, [user]);

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/15 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30 shadow-xs">
            <span className="live-dot bg-emerald-300"></span>
            <span>100% Escrow Protected Deliveries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Transactions & Escrow Milestone Tracking
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Live 7-step milestone verification guaranteeing immediate bank release upon quality confirmation at buyer drop facility.
          </p>
        </div>
      </div>

      {/* 2. TRANSACTIONS & ESCROW ORDERS LIST */}
      <div className="space-y-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6"
          >
            {/* TOP BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {deal.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Escrow ID: {deal.escrowId}</span>
                  {deal.status === 'APPROVED' && (
                    <span className="text-[11px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      ✓ Deal Confirmed & Funded
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {deal.quantity} {deal.unit} {deal.crop} → {deal.buyerName}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contract Value</div>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  ₹{deal.totalValue.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">100% Escrow Deposited 🛡️</span>
              </div>
            </div>

            {/* ROUTE INFORMATION CARD (PICKUP ➔ DROP) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                  <span>🚜</span>
                  <span>Origin: Your Farm-Gate Pickup</span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1">{deal.farmerName} (+91 {deal.farmerMobile})</div>
                <div className="text-xs text-slate-600">{deal.farmerPickupAddress}</div>
                <div className="text-[11px] font-bold text-emerald-800 pt-1">
                  ⏰ Scheduled Pickup: <strong>{deal.pickupDate}</strong>
                </div>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                  <span>🏢</span>
                  <span>Destination: Buyer Drop Warehouse Facility</span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1">{deal.buyerName}</div>
                <div className="text-xs text-slate-600">{deal.dropLocation}</div>
                <div className="text-[11px] font-bold text-blue-800 pt-1">
                  🚛 Logistics: {deal.transporterName} ({deal.vehicleNumber})
                </div>
              </div>
            </div>

            {/* 7-STEP MILESTONES */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Milestone Verification Lifecycle
              </h4>

              <div className="space-y-3">
                {deal.milestones.map((s, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0 ${
                        s.done
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {s.done ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-0.5">
                      <div>
                        <div className={`text-xs font-bold ${s.done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {s.label}
                        </div>
                        <div className="text-[10px] text-slate-400">{s.date}</div>
                      </div>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                          s.done
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                            : 'text-slate-400 bg-slate-50'
                        }`}
                      >
                        {s.done ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
