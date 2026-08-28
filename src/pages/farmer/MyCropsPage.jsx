import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const MyCropsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [crops, setCrops] = useState([
    {
      id: 'CROP-001',
      name: 'Nashik Red Onion',
      variety: 'Garwa Grade A',
      quantity: '100 Quintals (10,000 kg)',
      harvestDate: '15 May 2025',
      storageLocation: 'Ventilated Farm Shed, Ausa',
      status: 'Active',
      statusColor: 'emerald',
      estimatedValue: '₹2,10,000',
      activeOffers: 3,
    },
    {
      id: 'CROP-002',
      name: 'Hybrid Tomato',
      variety: 'Abhinav Grade A',
      quantity: '80 Quintals (8,000 kg)',
      harvestDate: '22 May 2025',
      storageLocation: 'Pre-cooled Crate Hub',
      status: 'Active',
      statusColor: 'emerald',
      estimatedValue: '₹1,32,000',
      activeOffers: 2,
    },
    {
      id: 'CROP-003',
      name: 'Yellow Soybean',
      variety: 'JS-335 (Moisture < 10%)',
      quantity: '60 Quintals',
      harvestDate: '10 April 2025',
      storageLocation: 'Adani Wilmar Mill Silo',
      status: 'Sold',
      statusColor: 'slate',
      estimatedValue: '₹2,61,000',
      activeOffers: 0,
    },
    {
      id: 'CROP-004',
      name: 'Thompson Grapes',
      variety: 'Export Grade B+',
      quantity: '120 Quintals',
      harvestDate: '28 March 2025',
      storageLocation: 'Dindori Cold Packhouse',
      status: 'Sold',
      statusColor: 'slate',
      estimatedValue: '₹6,24,000',
      activeOffers: 0,
    },
  ]);

  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Crops &amp; Harvest Inventory</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your active harvest inventory, quality grades, and listed produce lots.</p>
        </div>

        <button
          onClick={() => navigate('/farmer/list-produce')}
          className="px-5 py-2.5 bg-[#008253] hover:bg-[#007047] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>+</span>
          <span>List New Harvest Lot</span>
        </button>
      </div>

      {/* Crops List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-emerald-300 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{crop.id}</span>
                <h3 className="text-xl font-black text-slate-900">{crop.name}</h3>
                <div className="text-xs text-slate-500 font-medium">{crop.variety}</div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  crop.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {crop.status === 'Active' ? '● Active Lot' : '✓ Sold Out'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Quantity</span>
                <span className="font-bold text-slate-800">{crop.quantity}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Value</span>
                <span className="font-black text-emerald-700 font-mono text-sm">{crop.estimatedValue}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Storage</span>
                <span className="font-medium text-slate-700">{crop.storageLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Active Bids</span>
                <span className="font-bold text-slate-900">{crop.activeOffers} Verified Bids</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/farmer/advisory')}
                className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Optimize Profit →
              </button>
              <button
                onClick={() => navigate('/farmer/orders')}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                View Bids ({crop.activeOffers})
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MyCropsPage;
