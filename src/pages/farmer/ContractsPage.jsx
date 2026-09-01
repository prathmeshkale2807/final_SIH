import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRelativeDate } from '../../utils/dateUtils';

export const ContractsPage = () => {
  const { user } = useAuth();

  const [contracts] = useState([
    {
      id: 'CNT-2026-991',
      buyerName: 'AgroFresh Processors Ltd',
      crop: 'Nashik Red Onion (Grade A)',
      quantity: '60 Quintals',
      contractPrice: '₹1,850/q (₹21.85/kg Net)',
      totalValue: '₹1,11,000',
      escrowStatus: '100% Escrow Deposited',
      escrowProtected: true,
      pickupDate: `${getRelativeDate(3)} (Farm-Gate)`,
      status: 'Active',
    },
    {
      id: 'CNT-2026-840',
      buyerName: 'Adani Wilmar Crushing Mills',
      crop: 'Yellow Soybean JS-335',
      quantity: '60 Quintals',
      contractPrice: '₹4,450/q',
      totalValue: '₹2,67,000',
      escrowStatus: 'Settled to HDFC Bank A/C',
      escrowProtected: true,
      pickupDate: `Completed ${getRelativeDate(-20)}`,
      status: 'Completed',
    },
  ]);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Direct Procurement Contracts</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Legally binding, escrow-guaranteed digital contracts with certified institutional buyers.</p>
      </div>

      <div className="space-y-4">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{c.id}</span>
                <h3 className="text-xl font-black text-slate-900">{c.buyerName}</h3>
                <p className="text-xs text-slate-500 font-medium">{c.crop} • {c.quantity}</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-emerald-800 font-mono">{c.totalValue}</div>
                <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  {c.status === 'Active' ? '● Active Contract' : '✓ Completed & Paid'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Agreed Rate</span>
                <span className="font-bold text-slate-800">{c.contractPrice}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Logistics &amp; Delivery</span>
                <span className="font-bold text-slate-800">{c.pickupDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Escrow Security</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <span>🛡️</span>
                  <span>{c.escrowStatus}</span>
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                Download Signed Contract PDF
              </button>
              <button className="px-5 py-2 bg-[#008253] hover:bg-[#007047] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer">
                Track Escrow Funds
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ContractsPage;
