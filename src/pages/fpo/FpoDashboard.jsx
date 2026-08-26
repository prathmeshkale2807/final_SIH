import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';

export const FpoDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const [members, setMembers] = useState([
    { id: 1, name: 'Rahul Jadhav', village: 'Ausa, Latur', crop: 'Onion', lotQty: '100 Q', qtyNum: 100, status: 'READY_TO_POOL' },
    { id: 2, name: 'Sanjay Patil', village: 'Renapur, Latur', crop: 'Onion', lotQty: '150 Q', qtyNum: 150, status: 'READY_TO_POOL' },
    { id: 3, name: 'Vikas Shinde', village: 'Nilanga, Latur', crop: 'Soybean', lotQty: '80 Q', qtyNum: 80, status: 'POOLED' },
    { id: 4, name: 'Anand Deshmukh', village: 'Shirur, Latur', crop: 'Wheat', lotQty: '120 Q', qtyNum: 120, status: 'POOLED' }
  ]);

  const handleConsolidate = (id, name, crop, lotQty) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'POOLED' } : m))
    );
    showToast(`✓ Harvest lot of ${lotQty} ${crop} from ${name} consolidated into bulk truckload!`, 'success');
  };

  const pooledTotal = members
    .filter((m) => m.status === 'POOLED')
    .reduce((acc, m) => acc + m.qtyNum, 0);

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
      {/* BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-1">
            <span>🏛️</span>
            <span>Farmer Producer Organization Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Latur Krishi Vikas FPO
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Aggregated Pooling Desk • 142 Registered Member Farmers • 450 MT Warehouse Capacity
          </p>
        </div>
        <button
          onClick={() => navigate('/farmer/list-produce')}
          className="btn-shimmer px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all"
        >
          + Aggregate New Lot
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pooled Volume</div>
          <div className="text-2xl font-black text-slate-900 font-mono">{pooledTotal} <span className="text-xs text-slate-500 font-bold">Quintals</span></div>
          <p className="text-[11px] text-emerald-600 font-semibold">↑ 18% Higher Collective Bargaining Rate</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Member Farmers</div>
          <div className="text-2xl font-black text-slate-900 font-mono">142</div>
          <p className="text-[11px] text-slate-500">Marathwada cluster active</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Buyer Bids</div>
          <div className="text-2xl font-black text-blue-700 font-mono">5 Tenders</div>
          <p className="text-[11px] text-slate-500">Institutional Sourcing Active</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Collective Profit Boost</div>
          <div className="text-2xl font-black text-emerald-600 font-mono">+12.4%</div>
          <p className="text-[11px] text-slate-500">Zero broker commissions</p>
        </div>
      </div>

      {/* POOLED HARVEST TABLE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Member Harvest Lots Pending Consolidation
          </h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            {members.length} Lots Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-2">Farmer Name</th>
                <th className="pb-2">Village / Region</th>
                <th className="pb-2">Crop Variety</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900">{m.name}</td>
                  <td className="py-3.5 text-slate-500">{m.village}</td>
                  <td className="py-3.5 font-semibold text-slate-700">{m.crop}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900">{m.lotQty}</td>
                  <td className="py-3.5">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      m.status === 'READY_TO_POOL' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {m.status === 'READY_TO_POOL' ? (
                      <button
                        onClick={() => handleConsolidate(m.id, m.name, m.crop, m.lotQty)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] shadow-xs transition-all active:scale-95"
                      >
                        Consolidate
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-700">✓ Pooled in Lot</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FpoDashboard;
