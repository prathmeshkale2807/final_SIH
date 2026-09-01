import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getTodayFormatted, getRelativeDate } from '../../utils/dateUtils';

export const MyLotsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const computedLoc = user?.location || [user?.village, user?.taluka, user?.district, user?.state].filter(Boolean).join(', ') || 'Farm Gate / Shed';

  const [lots, setLots] = useState([
    {
      id: 'LOT-2026-ON-01',
      crop: `${user?.primaryCrop || 'Onion'} (Grade A / Standard)`,
      grade: 'Grade A (Export / Processing Quality)',
      qty: '100 Quintals',
      harvestDate: getTodayFormatted(),
      freshness: 'Fresh Harvest (< 48 hrs)',
      expectedPrice: '₹1,820 / q',
      status: 'ACTIVE',
      inquiries: 3,
      moisture: '8.5%',
      qrCodeGenerated: true,
      farmLocation: computedLoc,
    },
    {
      id: 'LOT-2026-TM-02',
      crop: 'Tomato (Hybrid Abhinav)',
      grade: 'Grade B (Standard Market)',
      qty: '40 Quintals',
      harvestDate: getRelativeDate(-7),
      freshness: 'Good Quality',
      expectedPrice: '₹3,100 / q',
      status: 'SOLD',
      inquiries: 5,
      moisture: '12.0%',
      qrCodeGenerated: true,
      farmLocation: computedLoc,
    },
  ]);

  const handleDownloadQR = (lotId) => {
    showToast(`✓ QR Lot Passport downloaded for ${lotId}. Verified by Krishak AI.`, 'success');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/15 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30 shadow-xs">
            <span className="live-dot bg-emerald-300"></span>
            <span>Active Harvest Batches</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Produce Lots & Harvest Passports
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Manage your verified farm harvest lots, download QR traceability tags, and review incoming direct buyer offers.
          </p>
        </div>

        <button
          onClick={() => navigate('/farmer/list-produce')}
          className="btn-shimmer px-6 py-3.5 bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center space-x-2 flex-shrink-0"
        >
          <span>+ Create New Produce Lot</span>
          <span>→</span>
        </button>
      </div>

      {/* LOTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lots.map((l) => (
          <div
            key={l.id}
            className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200/80 hover:border-emerald-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* TOP STRIP */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                  {l.id}
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs ${
                    l.status === 'ACTIVE'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {l.status === 'ACTIVE' ? '✓ ACTIVE LISTING' : 'COMPLETED / SOLD'}
                </span>
              </div>

              {/* CROP & GRADE */}
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{l.crop}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{l.grade}</p>
              </div>

              {/* SPECIFICATION GRID */}
              <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity</span>
                  <strong className="text-slate-900 text-sm font-mono">{l.qty}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Price</span>
                  <strong className="text-emerald-700 text-sm font-mono font-bold">{l.expectedPrice}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Harvest Date</span>
                  <span className="text-slate-700 font-medium">{l.harvestDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Moisture Level</span>
                  <span className="text-slate-700 font-medium">{l.moisture}</span>
                </div>
              </div>

              {/* INQUIRIES BADGE */}
              <div
                onClick={() => navigate('/farmer/offers')}
                className="text-xs text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100/80 p-3 rounded-2xl border border-emerald-200 cursor-pointer transition-all flex items-center justify-between"
              >
                <span>🤝 {l.inquiries} Verified Corporate Buyer Inquiries</span>
                <span className="text-emerald-700">View Offers →</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate('/farmer/best-deal')}
                className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1"
              >
                <span>🏆</span>
                <span>Optimize Profit</span>
              </button>

              <button
                onClick={() => handleDownloadQR(l.id)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1"
              >
                <span>🏷️</span>
                <span>QR Traceability</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLotsPage;
