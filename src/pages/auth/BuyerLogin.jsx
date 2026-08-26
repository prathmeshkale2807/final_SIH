import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { KrishakLogo } from '../../components/common/KrishakLogo';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { OTPInput } from '../../components/ui/OTPInput';

export const BuyerLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { loginBuyer } = useAuth();
  const { showToast } = useApp();

  const [step, setStep] = useState('phone');
  const [shopId, setShopId] = useState('BUY-2026-PN08');
  const [mobile, setMobile] = useState('9822012345');
  const [otp, setOtp] = useState('123456');

  const handleSendOTP = (e) => {
    e.preventDefault();
    setStep('otp');
    showToast('Demo OTP 123456 sent to +91 ' + mobile);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === '123456') {
      const res = await loginBuyer({ shopId, mobile });
      if (res.success) {
        showToast('Welcome Vikram Mehta (AgroFresh)');
        navigate('/buyer/dashboard');
      }
    } else {
      showToast('Invalid OTP. Use 123456', 'error');
    }
  };

  const handleQuickDemoLogin = async () => {
    showToast('Logging in as Vikram Mehta (AgroFresh Buyer)...');
    const res = await loginBuyer({ shopId: 'BUY-2026-PN08', mobile: '9822012345' });
    if (res.success) {
      showToast('✓ Welcome Vikram Mehta (AgroFresh)!', 'success');
      navigate('/buyer/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-between overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* CINEMATIC ENTERPRISE PROCUREMENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/farmer_hero_bg.jpg"
          alt="Agricultural procurement background"
          className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.85] contrast-[1.08] saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-blue-950/25 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/60 w-full lg:w-[70%]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-black/10"></div>
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-16 items-center gap-10">
        
        {/* LEFT COLUMN: ENTERPRISE BRANDING */}
        <div className="hidden lg:block lg:col-span-6 space-y-6 animate-fade-in-up">
          <Link to="/" className="inline-block">
            <KrishakLogo size="large" />
          </Link>

          <div className="inline-flex items-center space-x-2 bg-blue-100/90 text-blue-950 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs border border-blue-300">
            <span className="live-dot"></span>
            <span>Enterprise Procurement Portal</span>
          </div>

          <h1 className="text-4xl font-display font-black text-slate-900 leading-tight">
            Direct Farm-Gate Sourcing for Processors & Traders.
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-lg font-medium">
            Post procurement tenders, match with verified farmer lots, review quality parameters, and secure shipments through automated milestone escrow.
          </p>
        </div>

        {/* RIGHT COLUMN: BUYER SIGN IN FORM WITH FROSTED GLASS */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/90 space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-xs font-bold text-slate-500 hover:text-blue-800 flex items-center space-x-1 transition-colors">
              <span>← Back to Website</span>
            </button>
            <LanguageSwitcher />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase">
              <span>🏪</span>
              <span>Buyer / Trader Access</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{t('buyer_login_title', 'Buyer Sign In')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your procurement credentials to access the buyer terminal.</p>
          </div>

          {/* ONE CLICK QUICK ACCESS BUTTON */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100/80 border-2 border-dashed border-blue-300 rounded-2xl text-xs text-blue-950 font-bold flex items-center justify-between shadow-xs transition-all active:scale-98 group"
          >
            <div className="flex items-center space-x-2">
              <span className="text-base group-hover:scale-110 transition-transform">⚡</span>
              <div className="text-left">
                <span className="block font-black text-blue-900">1-Click Quick Demo Sign In</span>
                <span className="text-[10px] text-blue-700 font-medium">Auto-login as Vikram Mehta (AgroFresh)</span>
              </div>
            </div>
            <span className="text-xs bg-blue-600 text-white font-black px-2.5 py-1 rounded-xl shadow-xs">
              Enter →
            </span>
          </button>

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Buyer / Shop ID
                </label>
                <input
                  type="text"
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Registered Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 font-bold text-sm">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-12 p-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-shimmer w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
              >
                Send Sourcing OTP →
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5 animate-fade-in">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Enter 6-Digit SMS Code
                </label>
                <p className="text-[11px] text-slate-500">Sent to +91 {mobile}</p>
                <div className="pt-2">
                  <OTPInput value={otp} onChange={setOtp} />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button type="button" onClick={() => setStep('phone')} className="text-blue-700 font-bold hover:underline">
                  Change Number
                </button>
                <button type="button" onClick={() => showToast('Demo OTP is 123456')} className="text-slate-400 hover:text-slate-700">
                  Resend OTP in 24s
                </button>
              </div>

              <button
                type="submit"
                className="btn-shimmer w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
              >
                Verify OTP & Open Procurement Terminal →
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              New Institutional Buyer?{' '}
              <Link to="/register/buyer" className="text-blue-700 font-black hover:underline">
                Register Enterprise
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              Are you a Farmer?{' '}
              <Link to="/login/farmer" className="text-emerald-700 font-bold hover:underline">
                Farmer Sign In →
              </Link>
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-slate-200/60 bg-white/70 backdrop-blur-md">
        © 2026 KRISHAK • Enterprise Sourcing & Milestone Escrow Protocol
      </footer>

    </div>
  );
};
