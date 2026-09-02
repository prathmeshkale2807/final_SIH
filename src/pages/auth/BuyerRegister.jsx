import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LocationPicker } from '../../components/auth/LocationPicker';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const BuyerRegister = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { registerBuyer } = useAuth();
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    businessType: 'Food Processor',
    cropInterests: ['Onion', 'Tomato'],
    monthlyRequirement: '',
    city: '',
    state: 'Maharashtra',
    agreed: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      const res = await registerBuyer(formData);
      if (res && res.success) {
        showToast('Buyer registration submitted! Verification status: Pending KYC');
        navigate('/buyer/dashboard');
      } else {
        showToast(res?.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'An error occurred during registration.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-slate-50 px-4 py-8 overflow-hidden selection:bg-blue-500 selection:text-white">

      {/* CINEMATIC ENTERPRISE SOURCING BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/farmer_hero_bg.jpg"
          alt="Procurement background"
          className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.85] contrast-[1.08] saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-blue-950/25 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/80 to-slate-100/95"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full flex items-center justify-between">
        <button
          onClick={() => navigate('/login/buyer')}
          className="text-xs font-bold text-slate-600 hover:text-blue-800 flex items-center space-x-1 transition-colors bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200"
        >
          <span>← Back</span>
        </button>
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 max-w-lg mx-auto w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 space-y-6 my-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase">
            <span>🏪</span>
            <span>Enterprise Registration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{t('buyer_reg_title', 'Buyer Enterprise Registration')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Connect with verified FPO and smallholder farmer networks for direct farm gate sourcing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Business Name *</label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Secret key"
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Verify key"
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Business Category</label>
            <div className="grid grid-cols-3 gap-2">
              {['Wholesaler', 'Food Processor', 'Exporter', 'Retail Chain', 'Bulk Buyer', 'Aggregator'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, businessType: type })}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${formData.businessType === type
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <LocationPicker />

          <button
            type="submit"
            className="btn-shimmer w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
          >
            Submit Buyer Registration →
          </button>
        </form>
      </div>

      <footer className="relative z-10 py-3 text-center text-xs text-slate-500 bg-white/70 backdrop-blur-md border-t border-slate-200/60">
        © 2026 KRISHAK • Enterprise Sourcing Protocol
      </footer>
    </div>
  );
};
