import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { KrishakLogo } from '../../components/common/KrishakLogo';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { authService } from '../../services/authService';

export const FarmerLogin = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { loginFarmer } = useAuth();
  const { showToast } = useApp();

  // Login Method: 'farmerId' | 'mobile'
  const [loginMethod, setLoginMethod] = useState('farmerId');
  
  // Auth Type: 'otp' | 'password'
  const [authType, setAuthType] = useState('otp');
  
  // Step: 'input' | 'otp_verify'
  const [step, setStep] = useState('input');
  
  const [farmerId, setFarmerId] = useState('');
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
      const nextInput = document.getElementById(`farmer-otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`farmer-otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();

    if (loginMethod === 'farmerId') {
      if (!farmerId.trim()) {
        showToast(language === 'mr' ? 'कृपया शेतकरी आयडी प्रविष्ट करा' : 'Please enter your Farmer ID', 'error');
        return;
      }
    } else {
      if (!mobile || mobile.length !== 10) {
        showToast(language === 'mr' ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका' : 'Please enter a valid 10-digit mobile number', 'error');
        return;
      }
    }

    if (authType === 'password') {
      if (!password) {
        showToast(language === 'mr' ? 'कृपया पासवर्ड टाका' : 'Please enter your password', 'error');
        return;
      }
      setLoading(true);
      try {
        const res = await loginFarmer({ farmerId, mobile: mobile || '9876543210', otp: '123456' });
        if (res.success) {
          const name = res.user?.name || res.user?.farmerName || 'Farmer';
          showToast(language === 'mr' ? `स्वागत आहे, ${name}!` : `Welcome, ${name}!`, 'success');
          navigate('/');
        } else {
          showToast(res.message || 'Authentication failed', 'error');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // OTP Flow
    setLoading(true);
    try {
      const res = await authService.sendFarmerOTP(mobile || farmerId, farmerId);
      setStep('otp_verify');
      setCountdown(30);
      showToast(res.message || (language === 'mr' ? 'OTP पाठवला आहे (डेमो: 123456)' : 'OTP sent successfully (Demo: 123456)'), 'success');
    } catch (err) {
      setStep('otp_verify');
      setCountdown(30);
      showToast(language === 'mr' ? 'डेमो OTP वापरा: 123456' : 'Use Demo OTP: 123456', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      showToast(language === 'mr' ? 'कृपया पूर्ण ६ अंकी OTP टाका' : 'Please enter full 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await loginFarmer({ farmerId, mobile, otp: fullOtp });
      if (res.success) {
        const name = res.user?.name || res.user?.farmerName || 'Farmer';
        showToast(language === 'mr' ? `स्वागत आहे, ${name}!` : `Welcome, ${name}!`, 'success');
        navigate('/');
      } else {
        showToast(res.message || (language === 'mr' ? 'अवैध OTP. डेमो: 123456' : 'Invalid OTP. Demo: 123456'), 'error');
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      const res = await loginFarmer({ mobile: '9876543210', otp: '123456' });
      if (res.success) {
        showToast(language === 'mr' ? 'शेतकरी लॉगिन यशस्वी!' : 'Farmer Login Successful!', 'success');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* CINEMATIC SUNRISE FARMER BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <img
          src="/farmer_hero_bg.jpg"
          alt="Farmer in field at sunrise"
          className="w-full h-full object-cover object-[75%_35%] lg:object-[80%_35%] opacity-90 filter brightness-[0.88] contrast-[1.06] saturate-[1.12]"
        />
        <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/95 to-slate-50/60 w-full lg:w-[70%]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-transparent to-black/10"></div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-14 items-center gap-10">
        
        {/* LEFT COLUMN: BRANDING & PLATFORM VALUE PROPOSITION */}
        <div className="hidden lg:block lg:col-span-6 space-y-6 animate-fade-in-up">
          <Link to="/" className="inline-block">
            <KrishakLogo size="large" />
          </Link>

          <div className="inline-flex items-center space-x-2 bg-emerald-100/90 text-emerald-950 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs border border-emerald-300">
            <span className="live-dot"></span>
            <span>{language === 'mr' ? 'थेट शेतकरी डिजिटल पोर्टल' : 'Direct Farmer Marketplace'}</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-display font-black text-slate-900 leading-tight">
            {language === 'mr'
              ? 'शेतमालाला योग्य भाव व थेट खरेदीदारांशी जोडणी.'
              : 'Empowering Farmers to Make Smarter Selling Decisions.'}
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed max-w-lg font-medium">
            {language === 'mr'
              ? 'लाइव्ह कृषी उत्पन्न बाजार समितीचे भाव, थेट प्रक्रिया उद्योगांच्या खरेदी ऑर्डर्स आणि १००% सुरक्षित एस्क्रो पेमेंट पद्धतीचा लाभ घ्या.'
              : 'Access live APMC modal feeds, direct industrial buyer bids, AI price forecasts, and optimal profit allocation calculations with guaranteed escrow payouts.'}
          </p>

          <div className="pt-2 flex items-center space-x-6 text-xs font-bold text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>100% Escrow Protected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-harvest-500"></span>
              <span>AI Market Insights</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAHAVISTAAR CONCEPT LOGIN CARD */}
        <div className="lg:col-span-6 max-w-md mx-auto w-full bg-white/95 backdrop-blur-2xl rounded-[36px] p-6 sm:p-9 shadow-2xl border border-slate-200/90 space-y-6 animate-fade-in-up relative">
          
          {/* TOP ACTIONS: BACK & LANGUAGE */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-bold text-slate-500 hover:text-emerald-800 flex items-center space-x-1.5 transition-colors bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl border border-slate-200/60"
            >
              <span>← Back</span>
            </button>
            <LanguageSwitcher />
          </div>

          {/* DUAL ROLE SWITCHER: FARMER vs BUYER */}
          <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner flex items-center gap-1">
            <button
              type="button"
              className="flex-1 py-2 px-3 bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-700/25 flex items-center justify-center space-x-1.5"
            >
              <span>🌾</span>
              <span>{language === 'mr' ? 'शेतकरी लॉगिन' : 'Farmer Login'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/login/buyer')}
              className="flex-1 py-2 px-3 text-slate-600 hover:text-blue-700 hover:bg-white/80 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>🏪</span>
              <span>{language === 'mr' ? 'खरेदीदार पोर्टल' : 'Buyer Portal'}</span>
            </button>
          </div>

          {/* EMBLEM & WELCOME HEADING */}
          <div className="text-center space-y-3 pt-1">
            {/* CIRCULAR KRISHAK LOGO BADGE */}
            <div className="h-20 w-20 rounded-full bg-white border-2 border-emerald-300 mx-auto flex items-center justify-center p-2 shadow-lg shadow-emerald-500/15">
              <img
                src="/krishak_logo.png"
                alt="Krishak Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'mr' ? 'स्वागत आहे' : 'Welcome'}
              </h2>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-800">
                {language === 'mr' ? 'साइन इन करा!' : 'Sign In!'}
              </h3>
            </div>
          </div>

          {/* STEP 1: CREDENTIAL INPUT VIEW */}
          {step === 'input' && (
            <div className="space-y-5">
              
              {/* DUAL PILL TOGGLE TABS: FARMER ID vs MOBILE NO. */}
              <div className="p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner flex items-center">
                <button
                  type="button"
                  onClick={() => setLoginMethod('farmerId')}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    loginMethod === 'farmerId'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  {language === 'mr' ? 'शेतकरी आयडी' : 'Farmer ID'}
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMethod('mobile')}
                  className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    loginMethod === 'mobile'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  {language === 'mr' ? 'मोबाईल क्र.' : 'Mobile No.'}
                </button>
              </div>

              {/* INPUT FORM */}
              <form onSubmit={handleSendOTP} className="space-y-4">
                
                {loginMethod === 'farmerId' ? (
                  <div>
                    <input
                      type="text"
                      autoFocus
                      value={farmerId}
                      onChange={(e) => setFarmerId(e.target.value)}
                      placeholder={language === 'mr' ? 'तुमचा शेतकरी आयडी प्रविष्ट करा' : 'Enter your Farmer ID'}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="tel"
                      autoFocus
                      maxLength="10"
                      value={mobile}
                      onChange={handleMobileChange}
                      placeholder={language === 'mr' ? 'नोंदणीकृत मोबाईल नंबर प्रविष्ट करा' : 'Enter Registered Mobile Number'}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-mono"
                    />

                    {/* RADIO SELECTORS: OTP vs PASSWORD */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center space-x-5">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="farmerAuthType"
                            checked={authType === 'otp'}
                            onChange={() => setAuthType('otp')}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                          />
                          <span className={`text-xs font-bold ${authType === 'otp' ? 'text-emerald-900' : 'text-slate-500'}`}>
                            OTP
                          </span>
                        </label>

                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="farmerAuthType"
                            checked={authType === 'password'}
                            onChange={() => setAuthType('password')}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                          />
                          <span className={`text-xs font-bold ${authType === 'password' ? 'text-emerald-900' : 'text-slate-500'}`}>
                            Password
                          </span>
                        </label>
                      </div>

                      {authType === 'password' && (
                        <button
                          type="button"
                          onClick={() => showToast('Use OTP verification to sign in or reset credentials.', 'info')}
                          className="text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          Create/Forgot Password?
                        </button>
                      )}
                    </div>

                    {authType === 'password' && (
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      />
                    )}
                  </div>
                )}

                <div id="recaptcha-container"></div>

                {/* PRIMARY ACTION BUTTON */}
                <button
                  type="submit"
                  disabled={loading || (loginMethod === 'farmerId' ? !farmerId.trim() : mobile.length !== 10)}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block animate-spin">⏳</span>
                  ) : (
                    <span>{authType === 'password' ? 'Sign In' : (language === 'mr' ? 'OTP मिळवा (Send OTP)' : 'Send OTP')}</span>
                  )}
                </button>
              </form>

              {/* QUICK 1-CLICK DEMO BUTTON */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2.5 px-3 bg-slate-100/90 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-800 transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>🌾</span>
                  <span>{language === 'mr' ? 'चाचणी शेतकरी लॉगिन (1-Click Demo)' : '1-Click Demo Farmer Login'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION VIEW */}
          {step === 'otp_verify' && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'mr' ? 'OTP पडताळणी' : 'Enter 6-Digit OTP'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? 'नोंदणीकृत नंबरवर पाठवलेला OTP टाका' : 'Enter OTP sent to your registered mobile'}
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="flex justify-between gap-1.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`farmer-otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-10 sm:w-12 h-12 sm:h-14 text-center bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-lg font-mono font-black text-slate-900 transition-all outline-none"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {countdown > 0 ? (
                      <span className="font-mono text-emerald-700 font-bold">
                        {language === 'mr' ? `पुन्हा पाठवा: ${countdown}s` : `Resend in ${countdown}s`}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        {language === 'mr' ? 'OTP पुन्हा पाठवा' : 'Resend OTP'}
                      </button>
                    )}
                  </span>
                  <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Demo: 123456</span>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block animate-spin">⏳</span>
                  ) : (
                    <span>{language === 'mr' ? 'पडताळणी करा आणि लॉगिन व्हा' : 'Verify & Sign In'}</span>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setStep('input'); setOtp(['', '', '', '', '', '']); }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                  >
                    ← {language === 'mr' ? 'मागे जा (Go Back)' : 'Go Back'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FOOTER: NEW REGISTRATION LINK */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1">
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'खाते नाही का?' : "Don't have an account?"}
            </p>
            <Link
              to="/register/farmer"
              className="inline-block text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              {language === 'mr' ? 'नोंदणीसाठी येथे क्लिक करा (Click here for registration)' : 'Click here for registration →'}
            </Link>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 bg-white/70 backdrop-blur-md border-t border-slate-200/80">
        KrishiSetu AI • Direct Farmer-to-Buyer Marketplace • 100% Escrow Protection
      </footer>
    </div>
  );
};

export default FarmerLogin;
