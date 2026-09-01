import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { KrishakLogo } from '../../components/common/KrishakLogo';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { authService } from '../../services/authService';

export const BuyerLogin = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { loginBuyer } = useAuth();
  const { showToast } = useApp();

  // Login Method: 'buyerId' | 'mobile'
  const [loginMethod, setLoginMethod] = useState('mobile');
  
  // Auth Type: 'otp' | 'password'
  const [authType, setAuthType] = useState('otp');
  
  // Step: 'input' | 'otp_verify'
  const [step, setStep] = useState('input');
  
  const [buyerId, setBuyerId] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(val);
  };

  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`buyer-otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`buyer-otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const digits = pastedData.split('');
      const newOtp = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      const targetIdx = Math.min(digits.length, 5);
      const targetInput = document.getElementById(`buyer-otp-input-${targetIdx}`);
      if (targetInput) targetInput.focus();
    }
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();

    const targetMobile = mobile || buyerId;
    if (!targetMobile || targetMobile.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (authType === 'password') {
      if (!password) {
        showToast('Please enter your password', 'error');
        return;
      }
      setLoading(true);
      try {
        const res = await loginBuyer({ shopId: buyerId, mobile: targetMobile, password });
        if (res.success) {
          const name = res.user?.ownerName || res.user?.shopName || 'Buyer';
          showToast(`Welcome, ${name}!`, 'success');
          navigate('/');
        } else {
          showToast(res.message || 'Authentication failed', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Login failed', 'error');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendBuyerOTP(targetMobile);
      if (res.success) {
        setStep('otp_verify');
        setCountdown(res.cooldownSeconds || 60);
        showToast(res.message || 'OTP sent successfully to your mobile', 'success');
      } else {
        showToast(res.message || 'Failed to send OTP. Please try again.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Unable to send OTP. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      showToast('Please enter full 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const targetMobile = mobile || buyerId;
      const res = await loginBuyer({ shopId: buyerId, mobile: targetMobile, otp: fullOtp });
      if (res.success) {
        const name = res.user?.ownerName || res.user?.shopName || 'Buyer';
        showToast(`Welcome, ${name}!`, 'success');
        navigate('/');
      } else {
        showToast(res.message || 'Invalid or expired OTP', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/farmer_hero_bg.jpg"
          alt="Procurement Background"
          className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.85] contrast-[1.08] saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-blue-950/25 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/90 via-transparent to-black/10"></div>
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-14 items-center gap-10">
        
        <div className="hidden lg:block lg:col-span-6 space-y-6 animate-fade-in-up">
          <Link to="/" className="inline-block">
            <KrishakLogo size="large" />
          </Link>

          <div className="inline-flex items-center space-x-2 bg-blue-100/90 text-blue-950 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs border border-blue-300">
            <span className="live-dot"></span>
            <span>Enterprise Procurement Terminal</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 leading-tight">
            Direct Farm-Gate Sourcing for Processors & Traders.
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed max-w-lg font-medium">
            Post procurement tenders, match with verified farmer lots, review quality parameters, and secure shipments through automated milestone escrow.
          </p>

          <div className="pt-2 flex items-center space-x-6 text-xs font-bold text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span>100% Quality Inspected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Direct APMC & Farm Gate</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 max-w-md mx-auto w-full bg-white/95 backdrop-blur-2xl rounded-[36px] p-6 sm:p-9 shadow-2xl border border-slate-200/90 space-y-6 animate-fade-in-up relative">
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-bold text-slate-500 hover:text-blue-800 flex items-center space-x-1.5 transition-colors bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200/60 cursor-pointer"
            >
              <span>← Back</span>
            </button>
            <LanguageSwitcher />
          </div>

          {/* DUAL ROLE SWITCHER: FARMER vs BUYER */}
          <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate('/login/farmer')}
              className="flex-1 py-2 px-3 text-slate-600 hover:text-emerald-700 hover:bg-white/80 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>🌾</span>
              <span>Farmer Login</span>
            </button>
            <button
              type="button"
              className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-blue-700/25 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>🏪</span>
              <span>Buyer Portal</span>
            </button>
          </div>

          <div className="text-center space-y-3 pt-1">
            <div className="h-20 w-20 rounded-2xl bg-white border-2 border-blue-400 mx-auto flex items-center justify-center p-2 shadow-lg shadow-blue-500/15 overflow-hidden">
              <img
                src="/krishak_logo.png"
                alt="Krishak Logo"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>

            <div>
              <span className="text-[11px] font-mono tracking-widest text-blue-700 font-bold uppercase">
                Enterprise Sourcing Portal
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Buyer Sign In
              </h2>
            </div>
          </div>

          {step === 'input' && (
            <div className="space-y-4">
              <div className="p-1 bg-slate-100 rounded-xl border border-slate-200 flex items-center">
                <button
                  type="button"
                  onClick={() => setLoginMethod('mobile')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    loginMethod === 'mobile'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mobile No.
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('buyerId')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    loginMethod === 'buyerId'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Shop / Buyer ID
                </button>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                {loginMethod === 'buyerId' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Shop / Buyer ID
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={buyerId}
                      onChange={(e) => setBuyerId(e.target.value)}
                      placeholder="e.g. BUY-2026-1001"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-500 font-bold text-sm select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        autoFocus
                        maxLength="10"
                        value={mobile}
                        onChange={handleMobileChange}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center space-x-5 px-1">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="buyerAuthType"
                          checked={authType === 'otp'}
                          onChange={() => setAuthType('otp')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`text-xs font-bold ${authType === 'otp' ? 'text-blue-900' : 'text-slate-500'}`}>
                          SMS OTP
                        </span>
                      </label>
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="buyerAuthType"
                          checked={authType === 'password'}
                          onChange={() => setAuthType('password')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`text-xs font-bold ${authType === 'password' ? 'text-blue-900' : 'text-slate-500'}`}>
                          Password
                        </span>
                      </label>
                    </div>

                    {authType === 'password' && (
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                      />
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (loginMethod === 'buyerId' ? !buyerId.trim() : mobile.length !== 10)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? <span className="animate-spin">⏳</span> : <span>Send OTP</span>}
                </button>
              </form>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  New trader?{' '}
                  <Link to="/auth/buyer/register" className="text-blue-700 font-bold hover:underline">
                    Register as Buyer
                  </Link>
                </p>
              </div>
            </div>
          )}

          {step === 'otp_verify' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Enter 6-Digit OTP</h4>
                <p className="text-xs text-slate-500">
                  OTP sent to +91 {mobile.slice(0, 5)} {mobile.slice(5)}
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="flex justify-between gap-1.5" onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`buyer-otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-10 sm:w-12 h-12 sm:h-14 text-center bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg font-mono font-black text-slate-900 transition-all outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {countdown > 0 ? (
                      <span className="font-mono text-blue-700 font-bold">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-blue-700 font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('input');
                      setOtp(['', '', '', '', '', '']);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? <span className="animate-spin">⏳</span> : <span>Verify OTP & Log In</span>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} KRISHAK — Ministry of Agriculture & Farmers Welfare, Govt of India
      </footer>
    </div>
  );
};

export default BuyerLogin;
