import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { KrishakLogo } from '../../components/common/KrishakLogo';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin, loading } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const { t } = useLanguage();

  const [adminId, setAdminId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAutofill = () => {
    setAdminId('ADMIN-KRISHAK-01');
    setPasscode('admin2026');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!adminId.trim()) {
      setError('Please enter Admin ID or Email');
      return;
    }
    if (!passcode.trim()) {
      setError('Please enter Administrative Passcode');
      return;
    }

    setSubmitting(true);
    try {
      const res = await loginAdmin({ adminId: adminId.trim(), passcode: passcode.trim() });
      if (res.success) {
        if (showToast) showToast('Administrative access granted. Welcome to KRISHAK Control Tower.');
        navigate('/admin');
      } else {
        setError(res.message || 'Access Denied: Invalid administrative credentials');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate administrator');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden font-sans">
      
      {/* BACKGROUND GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOP HEADER */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl relative z-10">
        <Link to="/" className="flex items-center space-x-2">
          <KrishakLogo size="small" showTagline={false} />
          <span className="text-[10px] font-mono font-extrabold uppercase bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-800/60 tracking-wider">
            ADMIN CLEARANCE ONLY
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors font-semibold"
          >
            ← {t('back_to_home', 'Back to Public Site')}
          </Link>
        </div>
      </header>

      {/* MAIN LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-8">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          
          {/* SECURITY BADGE & HEADER */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-900 to-slate-800 border border-emerald-500/30 text-emerald-400 text-2xl shadow-inner">
              ⚙️
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Platform Control Tower
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Restricted portal for platform moderation, escrow clearance, and market price overrides.
            </p>
          </div>

          {/* DEMO AUTOFILL BANNER */}
          <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-2xl flex items-center justify-between gap-2">
            <div className="text-left">
              <div className="text-[11px] font-mono font-bold text-emerald-300">Demo Admin Account</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: ADMIN-KRISHAK-01 • Key: admin2026</div>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 font-black text-[10px] rounded-xl transition-all shadow-sm cursor-pointer"
            >
              1-Click Autofill
            </button>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-xs text-rose-200 font-semibold flex items-center space-x-2 animate-fade-in">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ADMIN IDENTIFIER INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Admin ID or Authorized Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. ADMIN-KRISHAK-01 or admin@krishak.ai"
                  required
                  className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white rounded-2xl px-4 py-3 text-xs font-mono placeholder:text-slate-600 transition-all outline-none"
                />
                <span className="absolute right-3.5 top-3.5 text-slate-500 text-xs">
                  🛡️
                </span>
              </div>
            </div>

            {/* PASSCODE / SECURITY KEY INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Administrative Security Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter security key or passcode"
                  required
                  className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white rounded-2xl px-4 py-3 text-xs font-mono placeholder:text-slate-600 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white text-xs transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting || loading ? (
                <span className="animate-pulse">Authenticating SuperAdmin...</span>
              ) : (
                <>
                  <span>Authorize & Enter Admin Portal</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* FOOTER NOTICE */}
          <div className="pt-2 text-center border-t border-slate-800 text-[10px] text-slate-500 font-mono">
            <span>Encrypted Session • IP Logged & 256-bit Audit Active</span>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center text-[11px] text-slate-600 border-t border-slate-900">
        KRISHAK Platform Operations • Confidential & Proprietary
      </footer>

    </div>
  );
};
