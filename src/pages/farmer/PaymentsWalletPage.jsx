import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const PaymentsWalletPage = () => {
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const [transactions] = useState([
    {
      id: 'TXN-7721',
      title: 'Soybean Lot Payout (Adani Wilmar)',
      date: '12 April 2025',
      amount: '+₹2,67,000',
      type: 'credit',
      mode: 'IMPS Direct to HDFC A/C •••• 4019',
      status: 'Completed',
    },
    {
      id: 'TXN-7650',
      title: 'Withdrawal to Bank Account',
      date: '15 April 2025',
      amount: '-₹2,50,000',
      type: 'debit',
      mode: 'Bank Transfer (UTR #98127391)',
      status: 'Completed',
    },
    {
      id: 'TXN-7510',
      title: 'Tomato Advance Escrow Lock (Keventer)',
      date: '24 May 2025',
      amount: '+₹51,600',
      type: 'credit',
      mode: 'Escrow Digital Wallet Settlement',
      status: 'Completed',
    },
  ]);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* Wallet Balance Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-[#062d1f] text-white p-6 sm:p-8 rounded-3xl border border-emerald-700/60 shadow-lg space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                FARMER ESCROW WALLET
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                ₹24,560.00
              </div>
              <p className="text-xs text-emerald-200 mt-1">Available instant withdrawal balance</p>
            </div>

            <button
              onClick={() => showToast && showToast('Withdrawal initiated to HDFC Bank A/C •••• 4019', 'success')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Withdraw to Bank
            </button>
          </div>

          <div className="pt-3 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-100 font-medium">
            <span>Primary Bank: HDFC Bank (IFSC: HDFC0001280)</span>
            <span className="text-emerald-300 font-bold">✓ Verified A/C</span>
          </div>
        </div>

        {/* Guaranteed Escrow Protection Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="text-2xl">🛡️</span>
              <h3 className="font-extrabold text-slate-900 text-base">100% Escrow Shield</h3>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Every buyer bid is backed by an upfront escrow deposit, ensuring zero default risk and immediate bank payout upon dispatch.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            Active Locked Escrow: ₹1,11,000
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">Transaction History &amp; Bank Statements</h3>

        <div className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <div key={t.id} className="py-3.5 flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 text-sm">{t.title}</div>
                <div className="text-slate-500">{t.mode} • {t.date}</div>
              </div>

              <div className="text-right">
                <div className={`font-mono font-black text-sm ${t.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {t.amount}
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PaymentsWalletPage;
