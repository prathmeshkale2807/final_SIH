import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { LocationPicker } from '../../components/auth/LocationPicker';
import { getRelativeDateISO } from '../../utils/dateUtils';

export const PostRequirementPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    cropName: 'Onion',
    variety: 'Nashik Red / Garwa',
    quantity: '2000',
    unit: 'KG',
    qualityRequirement: 'Grade A (Uniform size 50mm+)',
    maxBuyingPrice: '19', // per KG
    requiredByDate: getRelativeDateISO(7),
    deliveryPreference: 'Farm Gate Pickup by Buyer Truck',
    requirementType: 'Recurring Monthly Order',
    city: 'Pune APMC Yard',
    district: 'Pune',
    state: 'Maharashtra'
  });

  const handlePost = (e) => {
    e.preventDefault();
    showToast(`Buying tender broadcasted! 24 matching farmers found in Pune & Nashik clusters.`);
    navigate('/buyer/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">🏪</span>
          <span className="text-xs font-mono uppercase text-blue-400 font-bold">Enterprise Procurement Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          {t('post_req_title', 'Post Buying Requirement')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Broadcast your procurement needs directly to verified smallholders and FPOs with algorithmic 94% compatibility matching.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <form onSubmit={handlePost} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Target Crop *</label>
              <select
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
              >
                <option value="Onion">Onion (Pyaz / कांदा)</option>
                <option value="Tomato">Tomato (Tamatar / टोमॅटो)</option>
                <option value="Potato">Potato (Aloo / बटाटा)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Wheat">Wheat (Gehun / गहू)</option>
                <option value="Cotton">Cotton (Kapas / कापूस)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Required Quantity *</label>
              <input
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 font-mono text-base"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
              >
                <option value="KG">KG</option>
                <option value="Quintal">Quintal</option>
                <option value="Ton">Ton</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">{t('max_buying_price')} (₹ per {formData.unit}) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.maxBuyingPrice}
                  onChange={(e) => setFormData({ ...formData, maxBuyingPrice: e.target.value })}
                  className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Required By Date *</label>
              <input
                type="date"
                value={formData.requiredByDate}
                onChange={(e) => setFormData({ ...formData, requiredByDate: e.target.value })}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="text-xs font-bold text-slate-600 block mb-1">Delivery / Sourcing Location</label>
            <LocationPicker />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all"
          >
            Post Requirement Tender →
          </button>
        </form>
      </div>
    </div>
  );
};
