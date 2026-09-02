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
  const [loginMethod, setLoginMethod] = useState('mobile');

  const [authType, setAuthType] = useState('otp');
  const [hasPassword, setHasPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');

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
      const targetInput = document.getElementById(`farmer-otp-input-${targetIdx}`);
      if (targetInput) targetInput.focus();
    }
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault();

    const targetMobile = mobile || farmerId;
    if (!targetMobile || targetMobile.length < 10) {
      showToast(language === 'mr' ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका' : 'Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (authType === 'password') {
      if (!password) {
        showToast(language === 'mr' ? 'कृपया पासवर्ड टाका' : 'Please enter your password', 'error');
        return;
      }
      setLoading(true);
      try {
        const res = await loginFarmer({ farmerId, mobile: targetMobile, password });
        if (res.success) {
          const name = res.user?.name || res.user?.farmerName || 'Farmer';
          showToast(language === 'mr' ? `स्वागत आहे, ${name}!` : `Welcome, ${name}!`, 'success');
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

    // OTP Flow
    setLoading(true);
    try {
      const res = await authService.sendFarmerOTP(targetMobile);
      if (res.success) {
        setStep('otp_verify');
        setCountdown(res.cooldownSeconds || 60);
        if (res.devOtp) {
          const digits = res.devOtp.split('');
          setOtp(digits);
          showToast(`KRISHAK Verification Code: ${res.devOtp}`, 'info');
        } else {
          showToast(res.message || (language === 'mr' ? 'OTP यशस्वीरित्या पाठवला आहे' : 'OTP sent successfully to your mobile'), 'success');
        }
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
      showToast(language === 'mr' ? 'कृपया पूर्ण ६ अंकी OTP टाका' : 'Please enter full 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    try {
      const targetMobile = mobile || farmerId;
      const res = await loginFarmer({ farmerId, mobile: targetMobile, otp: fullOtp });
      if (res.success) {
        const name = res.user?.name || res.user?.farmerName || 'Farmer';
        showToast(language === 'mr' ? `स्वागत आहे, ${name}!` : `Welcome, ${name}!`, 'success');
        navigate('/');
      } else {
        showToast(res.message || (language === 'mr' ? 'अवैध किंवा कालबाह्य OTP' : 'Invalid or expired OTP'), 'error');
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
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
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/90 via-transparent to-black/10"></div>
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

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {language === 'mr' ? (
              <>
                शेतकऱ्यांचे हक्काचे <br />
                <span className="text-emerald-700">थेट डिजिटल मार्केट</span>
              </>
            ) : (
              <>
                Empowering Farmers with <br />
                <span className="text-emerald-700">Direct Market Access</span>
              </>
            )}
          </h1>

          <p className="text-base text-slate-700 max-w-lg leading-relaxed font-medium">
            {language === 'mr'
              ? 'दलालांशिवाय थेट खरेदीदारांशी व्यवहार करा, योग्य भाव मिळवा आणि पारदर्शक पेमेंटचा लाभ घ्या.'
              : 'Direct trade with verified buyers across India, fair APMC price intelligence, instant automated payments.'}
          </p>

          {/* FEATURE PILLS */}
          <div className="grid grid-cols-2 gap-3 pt-2 max-w-md">
            <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm backdrop-blur-xs">
              <span className="text-xl">💰</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{language === 'mr' ? 'योग्य भाव हमी' : 'Fair Pricing'}</h4>
                <p className="text-[10px] text-slate-500">{language === 'mr' ? 'थेट बाजारभाव' : 'Live Mandi Rates'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm backdrop-blur-xs">
              <span className="text-xl">🛡️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{language === 'mr' ? 'सुरक्षित पेमेंट' : '100% Secure'}</h4>
                <p className="text-[10px] text-slate-500">{language === 'mr' ? 'थेट बँक खात्यात' : 'Direct Bank Transfer'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN CARD */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto animate-fade-in">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 space-y-6">

            {/* CARD TOP BAR: LOGO & LANGUAGE SWITCHER */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <Link to="/" className="lg:hidden">
                <KrishakLogo size="small" />
              </Link>
              <div className="ml-auto">
                <LanguageSwitcher />
              </div>
            </div>

            {/* CARD TITLE */}
            <div className="space-y-1">
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                {language === 'mr' ? 'शेतकरी प्रवेशद्वार' : 'Farmer Access'}
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

                {/* DUAL PILL TOGGLE TABS */}
                <div className="p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner flex items-center">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('mobile')}
                    className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${loginMethod === 'mobile'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                      }`}
                  >
                    {language === 'mr' ? 'मोबाईल क्र.' : 'Mobile No.'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('farmerId')}
                    className={`flex-1 py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${loginMethod === 'farmerId'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 bg-transparent'
                      }`}
                  >
                    {language === 'mr' ? 'शेतकरी आयडी' : 'Farmer ID'}
                  </button>
                </div>

                {/* INPUT FORM */}
                <form onSubmit={handleSendOTP} className="space-y-4">

                  {loginMethod === 'farmerId' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {language === 'mr' ? 'शेतकरी आयडी' : 'Farmer ID'}
                      </label>
                      <input
                        type="text"
                        autoFocus
                        value={farmerId}
                        onChange={(e) => setFarmerId(e.target.value)}
                        placeholder={language === 'mr' ? 'उदा. FARM-2026-1001' : 'e.g. FARM-2026-1001'}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number'}
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
                          placeholder={language === 'mr' ? '१० अंकी मोबाईल नंबर टाका' : 'Enter 10-digit mobile number'}
                          className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all font-mono"
                        />
                      </div>

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
                              SMS OTP
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

                  {/* PRIMARY ACTION BUTTON */}
                  <button
                    type="submit"
                    disabled={loading || (loginMethod === 'farmerId' ? !farmerId.trim() : mobile.length !== 10)}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin">⏳</span>
                    ) : (
                      <span>
                        {authType === 'password'
                          ? 'Sign In'
                          : language === 'mr'
                            ? 'OTP मिळवा (Send OTP)'
                            : 'Send OTP'}
                      </span>
                    )}
                  </button>
                </form>

                {/* REGISTER LINK */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-600">
                    {language === 'mr' ? 'नवीन शेतकरी आहात?' : "Don't have an account?"}{' '}
                    <Link to="/register/farmer" className="text-emerald-700 font-bold hover:underline">
                      {language === 'mr' ? 'येथे नोंदणी करा' : 'Register as Farmer'}
                    </Link>
                  </p>
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
                    {language === 'mr'
                      ? `+91 ${mobile} या नंबरवर पाठवलेला कोड टाका`
                      : `OTP sent to +91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`}
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="flex justify-between gap-1.5" onPaste={handleOtpPaste}>
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

                  <div className="pt-2 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {language === 'mr' ? 'तुमचा पासवर्ड टाका' : (hasPassword ? 'Enter Password' : 'Set New Password')}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={language === 'mr' ? 'पासवर्ड' : 'Password'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                      />
                    </div>
                    {!hasPassword && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {language === 'mr' ? 'पासवर्डची पुष्टी करा' : 'Confirm Password'}
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={language === 'mr' ? 'पासवर्डची पुष्टी करा' : 'Verify Password'}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 font-medium text-sm focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                        />
                      </div>
                    )}
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
                          className="text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          {language === 'mr' ? 'OTP पुन्हा पाठवा' : 'Resend OTP'}
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
                      {language === 'mr' ? 'मोबाईल बदला' : 'Change Number'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6 || !password}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin">⏳</span>
                    ) : (
                      <span>{language === 'mr' ? 'OTP सत्यापित करा (Verify OTP)' : 'Verify OTP & Log In'}</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} KRISHAK — Ministry of Agriculture & Farmers Welfare, Govt of India
      </footer>
    </div>
  );
};

export default FarmerLogin;
