import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LocationPicker } from '../../components/auth/LocationPicker';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const FarmerRegister = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { registerFarmer } = useAuth();
  const { showToast } = useApp();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Rahul Jadhav',
    mobile: '9876543210',
    primaryCrop: 'Onion',
    otherCrops: 'Tomato, Soybean',
    landArea: '8.5',
    village: 'Ausa',
    taluka: 'Ausa',
    district: 'Latur',
    state: 'Maharashtra',
    gpsCoords: null
  });

  const updateField = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const handleFinish = async () => {
    const res = await registerFarmer(formData);
    if (res.success) {
      showToast('Account created successfully! Welcome to KRISHAK.');
      navigate('/farmer/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-slate-50 px-4 py-8 overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* CINEMATIC FARMER SUNRISE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/farmer_hero_bg.jpg"
          alt="Farmer in field at sunrise"
          className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.88] contrast-[1.06] saturate-[1.12]"
        />
        <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/80 to-slate-100/95"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full flex items-center justify-between">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate('/login/farmer'))}
          className="text-xs font-bold text-slate-600 hover:text-emerald-800 flex items-center space-x-1 transition-colors bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200"
        >
          <span>← Back</span>
        </button>
        <LanguageSwitcher />
      </div>

      {/* STEP INDICATOR */}
      <div className="relative z-10 max-w-lg mx-auto w-full mt-4 bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0"></div>
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black z-10 transition-all ${
                step >= s
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2 px-1">
          <span>Personal</span>
          <span>Farm</span>
          <span>Location</span>
          <span>Review</span>
        </div>
      </div>

      {/* MAIN FORM CARD */}
      <div className="relative z-10 max-w-lg mx-auto w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 space-y-6 my-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {step === 1 && t('step1_title', 'Step 1: Personal Information')}
            {step === 2 && t('step2_title', 'Step 2: Farm & Crop Details')}
            {step === 3 && t('step3_title', 'Step 3: Location Verification')}
            {step === 4 && t('step4_title', 'Step 4: Review & Register')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Please provide accurate farm information for optimal buyer matching.</p>
        </div>

        {/* STEP 1: PERSONAL INFO */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('full_name', 'Full Name')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Rahul Jadhav"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('mobile_label', 'Mobile Number')} *
              </label>
              <input
                type="tel"
                maxLength="10"
                required
                value={formData.mobile}
                onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              Continue to Farm Details →
            </button>
          </div>
        )}

        {/* STEP 2: FARM DETAILS */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('primary_crop', 'Primary Harvest Crop')} *
              </label>
              <select
                value={formData.primaryCrop}
                onChange={(e) => updateField('primaryCrop', e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('land_area', 'Approximate Land Area (Acres)')} *
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.landArea}
                onChange={(e) => updateField('landArea', e.target.value)}
                placeholder="5"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t('other_crops', 'Other Crops Cultivated')}
              </label>
              <input
                type="text"
                value={formData.otherCrops}
                onChange={(e) => updateField('otherCrops', e.target.value)}
                placeholder="e.g. Tomato, Soybean"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              Continue to Location →
            </button>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {step === 3 && (
          <div className="space-y-4">
            <LocationPicker onLocationSelect={(coords) => updateField('gpsCoords', coords)} />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {t('village', 'Village / Town')}
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => updateField('village', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {t('district', 'District')}
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              Review Registration →
            </button>
          </div>
        )}

        {/* STEP 4: REVIEW & REGISTER */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-900">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile:</span>
                <span className="font-bold text-slate-900">+91 {formData.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Crop:</span>
                <span className="font-bold text-emerald-700">{formData.primaryCrop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Land Area:</span>
                <span className="font-bold text-slate-900">{formData.landArea} Acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{formData.village}, {formData.district}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>{t('create_farmer_account', 'Create Farmer Account')} ✓</span>
            </button>
          </div>
        )}

        <div className="border-t border-slate-100 pt-3 text-center">
          <Link to="/login/farmer" className="text-xs font-bold text-slate-500 hover:text-slate-900">
            {t('already_have_account', 'Already registered? Login here')}
          </Link>
        </div>
      </div>
    </div>
  );
};
