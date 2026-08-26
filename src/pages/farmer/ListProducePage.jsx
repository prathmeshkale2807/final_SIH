import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { LocationPicker } from '../../components/auth/LocationPicker';

export const ListProducePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cropName: 'Onion',
    variety: 'Nashik Red Onion',
    category: 'Vegetables / Allium',
    quantity: '500',
    unit: 'KG', // KG | Quintal | Ton
    qualityGrade: 'Grade A (Export / Processing Quality)',
    size: 'Medium (45mm - 60mm)',
    harvestDate: '2026-08-24',
    freshness: 'Fresh Harvest (< 48 hrs)',
    expectedPrice: '18', // per KG
    village: 'Dindori',
    taluka: 'Dindori',
    district: 'Nashik',
    state: 'Maharashtra',
    gpsCoords: null
  });

  const benchmarkData = {
    currentMarketRange: '₹15 – ₹18 / KG (₹1,500 – ₹1,800 / Q)',
    historicalTrend: '📈 Rising (+5.1% this week)',
    predictedRange: '₹17 – ₹20 / KG (Next 7 Days)',
    confidence: '78%'
  };

  const handlePublish = (e) => {
    e.preventDefault();
    showToast(`Produce listing published! ${formData.quantity} ${formData.unit} of ${formData.variety} is now live.`);
    navigate('/farmer/lots');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl">📦</span>
          <span className="text-xs font-mono uppercase text-emerald-300 font-bold">Farmer Marketplace Listing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
          {t('list_produce_title', 'List Produce for Sale')}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
          {t('list_produce_sub', 'Provide crop details, quantity, quality grade, and your expected price to receive optimized market matches.')}
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* SECTION 1: CROP DETAILS */}
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
              <span>Crop Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Crop Name *</label>
                <select
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white"
                >
                  <option value="Onion">🧅 Onion (Pyaz / कांदा)</option>
                  <option value="Tomato">🍅 Tomato (Tamatar / टोमॅटो)</option>
                  <option value="Potato">🥔 Potato (Aloo / बटाटा)</option>
                  <option value="Soybean">🌱 Soybean (सोयाबीन)</option>
                  <option value="Wheat">🌾 Wheat (Gehun / गहू)</option>
                  <option value="Cotton">☁️ Cotton (Kapas / कापूस)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Variety *</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder="e.g. Nashik Red Onion"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: QUANTITY */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">2</span>
              <span>Available Quantity</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Available Quantity *</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white font-mono text-base"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Measurement Unit *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['KG', 'Quintal', 'Ton'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({ ...formData, unit: u })}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                        formData.unit === u
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: QUALITY DETAILS */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
              <span>Quality & Harvest Details</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Quality Grade *</label>
                <select
                  value={formData.qualityGrade}
                  onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                >
                  <option value="Grade A (Export / Processing Quality)">Grade A (Export / Processing)</option>
                  <option value="Grade B (Standard Mandi Quality)">Grade B (Standard Market)</option>
                  <option value="Grade C (Local Consumption)">Grade C (Local Mandi)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Size Classification</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Harvest Date</label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: EXPECTED PRICE & BENCHMARK INTELLIGENCE */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">4</span>
              <span>Pricing Strategy & Market Intelligence</span>
            </h2>

            {/* BENCHMARK CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-0.5">Current Market Range</span>
                <span className="font-bold text-slate-900 font-mono">{benchmarkData.currentMarketRange}</span>
              </div>
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs">
                <span className="text-emerald-700 block mb-0.5">Historical Trend</span>
                <span className="font-bold text-emerald-900">{benchmarkData.historicalTrend}</span>
              </div>
              <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 text-xs">
                <span className="text-blue-700 block mb-0.5">AI Predicted (Next 7D)</span>
                <span className="font-bold text-blue-900 font-mono">{benchmarkData.predictedRange} (78% Conf)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  My Expected Price (₹ per {formData.unit}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-800 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, expectedPrice: '18' })}
                  className="py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 transition-all w-full text-center"
                >
                  Use AI Recommended Price (₹18 / {formData.unit})
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: PRODUCE LOCATION */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">5</span>
              <span>Farm Pickup Location</span>
            </h2>

            <LocationPicker onLocationSelect={(coords) => setFormData({ ...formData, gpsCoords: coords })} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Village</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Taluka</label>
                <input
                  type="text"
                  value={formData.taluka}
                  onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* PUBLISH BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              🔒 Listing is matched automatically with verified bulk buyers and APMC buyers.
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/25 transition-all"
            >
              {t('publish_produce', 'Publish Produce Listing')} ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
