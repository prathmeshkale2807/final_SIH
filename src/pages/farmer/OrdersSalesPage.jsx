import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const OrdersSalesPage = () => {
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const [orders, setOrders] = useState([
    {
      id: 'ORD-9821',
      buyer: 'AgroFresh Processors Ltd',
      crop: 'Nashik Red Onion (Garwa Grade A)',
      quantity: '60 Quintals',
      amount: '₹1,11,000',
      date: 'Today, 28 May 2025',
      status: 'In Progress (Pickup Scheduled)',
      stage: 3,
    },
    {
      id: 'ORD-9740',
      buyer: 'Reliance Fresh Sourcing Hub',
      crop: 'Hybrid Tomato (Abhinav)',
      quantity: '50 Quintals',
      amount: '₹86,000',
      date: '26 May 2025',
      status: 'Quality Verification Completed',
      stage: 2,
    },
    {
      id: 'ORD-9610',
      buyer: 'Keventer Agro Processing Ltd',
      crop: 'Hybrid Tomato (Grade A)',
      quantity: '30 Quintals',
      amount: '₹51,600',
      date: '24 May 2025',
      status: 'Payment Released to Bank',
      stage: 4,
    },
  ]);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Orders &amp; Sales Management</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Track procurement order dispatch, gate pass, weighing slips, and bank settlements.</p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{o.id} • {o.date}</span>
                <h3 className="text-xl font-black text-slate-900">{o.buyer}</h3>
                <p className="text-xs text-slate-500 font-medium">{o.crop} • {o.quantity}</p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-emerald-800 font-mono">{o.amount}</div>
                <span className="inline-block text-[10px] font-bold bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full">
                  {o.status}
                </span>
              </div>
            </div>

            {/* 4-Stage Visual Timeline */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ 1. Escrow Deposited
              </div>
              <div className={`p-2.5 rounded-xl border ${o.stage >= 2 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                {o.stage >= 2 ? '✓' : '2.'} 2. Quality Checked
              </div>
              <div className={`p-2.5 rounded-xl border ${o.stage >= 3 ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                {o.stage >= 3 ? '●' : '3.'} 3. Truck Dispatched
              </div>
              <div className={`p-2.5 rounded-xl border ${o.stage >= 4 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400'}`}>
                {o.stage >= 4 ? '✓' : '4.'} 4. Bank Payout
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrdersSalesPage;
