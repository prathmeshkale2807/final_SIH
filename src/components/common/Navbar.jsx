import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { KrishakLogo } from './KrishakLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, logout } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      if (showToast) showToast('Logged out of session');
      navigate('/');
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isCurrentActive = (path) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)]' 
        : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs'
    }`}>
      {/* TOP LIVE MANDI APMC MARQUEE STREAM */}
      <div className="bg-slate-950 text-white text-[11px] font-mono py-1 px-4 overflow-hidden border-b border-slate-800 flex items-center select-none">
        <div className="flex-shrink-0 flex items-center space-x-2 mr-4 bg-emerald-800 text-white font-bold px-2.5 py-0.5 rounded-md border border-emerald-600/60 z-10 shadow-xs">
          <span className="live-dot"></span>
          <span className="uppercase text-[10px] tracking-wider">LIVE MANDI FEED</span>
        </div>
        <div className="flex whitespace-nowrap overflow-hidden w-full">
          <div className="inline-flex space-x-8 animate-marquee">
            <span className="text-slate-300">🧅 Nashik Red Onion: <strong className="text-emerald-400">₹18.40/kg</strong> <span className="text-emerald-400 font-bold">(+5.2%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🍅 Pune Hybrid Tomato: <strong className="text-emerald-400">₹32.10/kg</strong> <span className="text-rose-400 font-bold">(-2.4%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🥔 Mumbai Potato: <strong className="text-emerald-400">₹24.50/kg</strong> <span className="text-emerald-400 font-bold">(+1.8%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🌾 Latur Soybean: <strong className="text-harvest-400">₹4,650/Q</strong> <span className="text-emerald-400 font-bold">(+3.1%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🛡️ 100% Escrow Protected: <strong className="text-emerald-300">₹1.42 Cr</strong> Settlements</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">⚡ AI Market Recommendation: <strong className="text-harvest-300">Hold 1 Day for +₹1.20/kg Gain</strong></span>
            <span className="text-slate-500">•</span>
          </div>
          <div className="inline-flex space-x-8 animate-marquee" aria-hidden="true">
            <span className="text-slate-300">🧅 Nashik Red Onion: <strong className="text-emerald-400">₹18.40/kg</strong> <span className="text-emerald-400 font-bold">(+5.2%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🍅 Pune Hybrid Tomato: <strong className="text-emerald-400">₹32.10/kg</strong> <span className="text-rose-400 font-bold">(-2.4%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🥔 Mumbai Potato: <strong className="text-emerald-400">₹24.50/kg</strong> <span className="text-emerald-400 font-bold">(+1.8%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🌾 Latur Soybean: <strong className="text-harvest-400">₹4,650/Q</strong> <span className="text-emerald-400 font-bold">(+3.1%)</span></span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">🛡️ 100% Escrow Protected: <strong className="text-emerald-300">₹1.42 Cr</strong> Settlements</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">⚡ AI Market Recommendation: <strong className="text-harvest-300">Hold 1 Day for +₹1.20/kg Gain</strong></span>
            <span className="text-slate-500">•</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* ========================================================================= */}
        {/* BRAND LOGO */}
        {/* ========================================================================= */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : isFarmer ? '/farmer/dashboard' : '/buyer/dashboard') : '/'}
            className="flex items-center focus:outline-none"
            aria-label="Krishak Home"
          >
            <KrishakLogo size="normal" showTagline={true} />
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* PUBLIC DESKTOP NAVIGATION */}
        {/* ========================================================================= */}
        {!isAuthenticated && (
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs xl:text-sm font-bold text-slate-600">
            <button
              onClick={() => scrollToSection('hero')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-800 hover:bg-emerald-50/80 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {t('nav_home', 'Home')}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-800 hover:bg-emerald-50/80 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {t('how_it_works', 'How It Works')}
            </button>
            <button
              onClick={() => scrollToSection('market-intelligence')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-800 hover:bg-emerald-50/80 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {t('nav_markets', 'Market Intelligence')}
            </button>
            <button
              onClick={() => scrollToSection('ai-insights')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-800 hover:bg-emerald-50/80 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {t('nav_ai', 'AI Insights')}
            </button>
            <button
              onClick={() => scrollToSection('why-krishak')}
              className="px-3.5 py-2 rounded-xl hover:text-emerald-800 hover:bg-emerald-50/80 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {t('why_krishak', 'Why KRISHAK')}
            </button>
            <Link
              to="/fpo"
              className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center space-x-1 ${
                isCurrentActive('/fpo')
                  ? 'text-emerald-900 bg-emerald-100/90 font-black shadow-xs'
                  : 'hover:text-emerald-800 hover:bg-emerald-50/80'
              }`}
            >
              <span>🏛️</span>
              <span>{t('fpo_hub', 'FPO Hub')}</span>
            </Link>
          </nav>
        )}

        {/* ========================================================================= */}
        {/* AUTHENTICATED ADMIN DESKTOP NAV SHORTCUTS (ONLY VISIBLE TO ADMIN) */}
        {/* ========================================================================= */}
        {isAuthenticated && isAdmin && (
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900 text-white p-1 rounded-2xl border border-slate-800 text-xs font-bold shadow-md">
            <Link
              to="/admin"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white shadow-xs font-black flex items-center space-x-1.5"
            >
              <span>⚙️</span>
              <span>Control Tower</span>
            </Link>
            <span className="text-slate-500 px-2 text-[10px] font-mono font-bold uppercase">
              SUPERADMIN PRIVILEGES ACTIVE
            </span>
          </nav>
        )}

        {/* ========================================================================= */}
        {/* AUTHENTICATED FARMER DESKTOP NAV SHORTCUTS */}
        {/* ========================================================================= */}
        {isAuthenticated && isFarmer && (
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold shadow-inner">
            <Link
              to="/farmer/dashboard"
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                isCurrentActive('/farmer/dashboard')
                  ? 'bg-white text-emerald-950 shadow-xs font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {t('nav_home', 'Dashboard')}
            </Link>
            <Link
              to="/farmer/list-produce"
              className="btn-shimmer px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md shadow-emerald-600/25 font-black transition-all transform hover:scale-[1.02] active:scale-95 flex items-center space-x-1"
            >
              <span>+ {t('nav_sell', 'Sell Produce')}</span>
            </Link>
            <Link
              to="/farmer/best-deal"
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1 ${
                isCurrentActive('/farmer/best-deal')
                  ? 'bg-harvest-100 text-harvest-900 border border-harvest-300 font-black shadow-xs'
                  : 'bg-harvest-50 text-harvest-800 hover:bg-harvest-100/80'
              }`}
            >
              <span>🏆</span>
              <span>{t('nav_deals', 'Best Deal')}</span>
            </Link>
            <Link
              to="/farmer/markets"
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                isCurrentActive('/farmer/markets')
                  ? 'bg-white text-emerald-950 shadow-xs font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {t('nav_markets', 'Markets')}
            </Link>
            <Link
              to="/fpo"
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                isCurrentActive('/fpo')
                  ? 'bg-white text-emerald-950 shadow-xs font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {t('fpo_hub', 'FPO Hub')}
            </Link>
          </nav>
        )}

        {/* ========================================================================= */}
        {/* AUTHENTICATED BUYER DESKTOP NAV SHORTCUTS */}
        {/* ========================================================================= */}
        {isAuthenticated && isBuyer && (
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs font-bold shadow-inner">
            <Link
              to="/buyer/dashboard"
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                isCurrentActive('/buyer/dashboard')
                  ? 'bg-white text-blue-950 shadow-xs font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {t('nav_home', 'Dashboard')}
            </Link>
            <Link
              to="/buyer/post-requirement"
              className="btn-shimmer px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-600/25 font-black transition-all transform hover:scale-[1.02] active:scale-95 flex items-center space-x-1"
            >
              <span>+ {t('nav_post', 'Post Tender')}</span>
            </Link>
            <Link
              to="/buyer/find-farmers"
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                isCurrentActive('/buyer/find-farmers')
                  ? 'bg-white text-blue-950 shadow-xs font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {t('nav_search', 'Find Farmers')}
            </Link>
            <Link
              to="/buyer/shipments"
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                isCurrentActive('/buyer/shipments')
                  ? 'bg-white text-blue-950 shadow-xs font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {t('nav_orders', 'Orders & Escrow')}
            </Link>
          </nav>
        )}

        {/* ========================================================================= */}
        {/* RIGHT CONTROLS: LANGUAGE, AUTH ACTIONS, LOGOUT ICON BUTTON */}
        {/* ========================================================================= */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* LANGUAGE SELECTOR */}
          <LanguageSwitcher />

          {/* NOTIFICATIONS DROPDOWN */}
          <NotificationDropdown />

          {!isAuthenticated ? (
            /* GUEST USER CTAS */
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                to="/login/farmer"
                className="px-3.5 py-2 text-slate-700 hover:text-emerald-800 text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-100 transition-all"
              >
                {t('sign_in', 'Sign In')}
              </Link>

              <Link
                to="/login/farmer"
                className="btn-shimmer group px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-black shadow-md shadow-emerald-600/25 transition-all flex items-center space-x-1.5"
              >
                <span>🌾</span>
                <span>{t('start_selling', 'Start Selling')}</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 text-harvest-300">→</span>
              </Link>
            </div>
          ) : (
            /* AUTHENTICATED USER CHIP & LOGOUT ICON BUTTON */
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* USER INFO BADGE */}
              <div className="hidden sm:flex items-center space-x-2.5 pl-2 py-1 pr-3 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                  isAdmin ? 'bg-slate-900 text-emerald-400' : isFarmer ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isAdmin ? '⚙️' : isFarmer ? '🌾' : '🏪'}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-black text-slate-900 max-w-[120px] truncate">
                    {isAdmin ? 'SuperAdmin' : user?.name || user?.businessName || 'User'}
                  </div>
                  <div className={`text-[10px] font-mono font-bold capitalize ${
                    isAdmin ? 'text-emerald-700 font-black' : isFarmer ? 'text-emerald-700' : 'text-blue-700'
                  }`}>
                    {isAdmin ? 'Platform Admin' : user?.role || 'Member'}
                  </div>
                </div>
              </div>

              {/* DEDICATED LOGOUT BUTTON WITH ICON */}
              <button
                onClick={handleLogout}
                title="Sign out of your account"
                aria-label="Logout"
                className="group relative flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 bg-slate-100/90 hover:bg-rose-50 border border-slate-200/90 hover:border-rose-300/80 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 shadow-xs hover:shadow-rose-100 cursor-pointer"
              >
                <i className="ri-logout-box-r-line text-sm sm:text-base text-slate-500 group-hover:text-rose-600 group-hover:-translate-x-0.5 transition-all"></i>
                <span className="hidden sm:inline">{t('logout', 'Logout')}</span>
              </button>
            </div>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2.5 rounded-xl border transition-all duration-200 text-lg flex items-center justify-center ${
              !isAuthenticated ? 'lg:hidden' : 'md:hidden'
            } ${
              mobileMenuOpen
                ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <i className={`transition-transform duration-300 ${
              mobileMenuOpen ? 'ri-close-large-line rotate-90 text-white' : 'ri-menu-4-line'
            }`}></i>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE ANIMATED DRAWER */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className={`bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-4 py-5 space-y-4 shadow-2xl animate-slide-down ${
          !isAuthenticated ? 'lg:hidden' : 'md:hidden'
        }`}>
          {/* USER SUMMARY CARD IN MOBILE DRAWER IF AUTHENTICATED */}
          {isAuthenticated && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-slate-50 to-blue-50 border border-slate-200/90 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
                  isAdmin ? 'bg-slate-900 text-emerald-400' : isFarmer ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {isAdmin ? '⚙️' : isFarmer ? '🌾' : '🏪'}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">
                    {isAdmin ? 'SuperAdmin' : user?.name || user?.businessName || 'User'}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
                    {isAdmin ? 'ADMINISTRATOR' : user?.id || (isFarmer ? 'FARMER' : 'BUYER')}
                  </div>
                </div>
              </div>

              {/* LOGOUT BUTTON IN MOBILE DRAWER HEADER */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer"
              >
                <i className="ri-logout-box-r-line text-sm"></i>
                <span>{t('logout', 'Logout')}</span>
              </button>
            </div>
          )}

          {/* PUBLIC MOBILE NAVIGATION LINKS */}
          {!isAuthenticated && (
            <nav className="flex flex-col space-y-1 text-sm font-bold text-slate-700">
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <span className="text-base">🏡</span>
                <span>{t('nav_home', 'Home')}</span>
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <span className="text-base">⚙️</span>
                <span>{t('how_it_works', 'How It Works')}</span>
              </button>
              <button
                onClick={() => scrollToSection('market-intelligence')}
                className="flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <span className="text-base">📊</span>
                <span>{t('nav_markets', 'Market Intelligence')}</span>
              </button>
              <button
                onClick={() => scrollToSection('ai-insights')}
                className="flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <span className="text-base">🤖</span>
                <span>{t('nav_ai', 'AI Insights & Decision Engine')}</span>
              </button>
              <button
                onClick={() => scrollToSection('why-krishak')}
                className="flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <span className="text-base">✨</span>
                <span>{t('why_krishak', 'Why KRISHAK')}</span>
              </button>
              <Link
                to="/fpo"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 text-left py-2.5 px-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                <span className="text-base">🏛️</span>
                <span>{t('fpo_hub', 'FPO Collective Hub')}</span>
              </Link>
            </nav>
          )}

          {/* AUTHENTICATED ADMIN MOBILE SHORTCUTS (ONLY FOR ADMIN) */}
          {isAuthenticated && isAdmin && (
            <nav className="flex flex-col space-y-2 text-xs font-bold pt-1">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between font-black shadow-md border border-slate-800"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 text-base">⚙️</span>
                  <span>SuperAdmin Control Tower</span>
                </div>
                <span className="text-emerald-400 font-mono text-[10px]">ACTIVE</span>
              </Link>
            </nav>
          )}

          {/* AUTHENTICATED MOBILE SHORTCUTS */}
          {isAuthenticated && isFarmer && (
            <nav className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-800"
              >
                <i className="ri-dashboard-line text-emerald-600 text-base"></i>
                <span>{t('nav_home', 'Dashboard')}</span>
              </Link>
              <Link
                to="/farmer/list-produce"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-emerald-600 text-white rounded-xl flex items-center space-x-2 font-black shadow-sm"
              >
                <i className="ri-add-circle-line text-white text-base"></i>
                <span>+ {t('nav_sell', 'Sell Produce')}</span>
              </Link>
              <Link
                to="/farmer/best-deal"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-harvest-50 border border-harvest-200 rounded-xl flex items-center space-x-2 text-harvest-900 font-extrabold"
              >
                <span>🏆</span>
                <span>{t('nav_deals', 'Best Deal')}</span>
              </Link>
              <Link
                to="/farmer/markets"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-800"
              >
                <i className="ri-line-chart-line text-emerald-600 text-base"></i>
                <span>{t('nav_markets', 'APMC Mandis')}</span>
              </Link>
              <Link
                to="/farmer/offers"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-800"
              >
                <i className="ri-hand-heart-line text-emerald-600 text-base"></i>
                <span>{t('nav_offers', 'Buyer Offers')}</span>
              </Link>
              <Link
                to="/farmer/transactions"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-800"
              >
                <i className="ri-shield-check-line text-emerald-600 text-base"></i>
                <span>{t('nav_escrow', 'Escrow Payouts')}</span>
              </Link>
            </nav>
          )}

          {isAuthenticated && isBuyer && (
            <nav className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
              <Link
                to="/buyer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-800"
              >
                <i className="ri-dashboard-line text-blue-600 text-base"></i>
                <span>{t('nav_home', 'Dashboard')}</span>
              </Link>
              <Link
                to="/buyer/post-requirement"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-blue-600 text-white rounded-xl flex items-center space-x-2 font-black shadow-sm"
              >
                <i className="ri-add-circle-line text-white text-base"></i>
                <span>+ {t('nav_post', 'Post Tender')}</span>
              </Link>
              <Link
                to="/buyer/find-farmers"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-800"
              >
                <i className="ri-user-search-line text-blue-600 text-base"></i>
                <span>{t('nav_search', 'Find Farmers')}</span>
              </Link>
              <Link
                to="/buyer/shipments"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-800"
              >
                <i className="ri-truck-line text-blue-600 text-base"></i>
                <span>{t('nav_orders', 'Orders & Escrow')}</span>
              </Link>
            </nav>
          )}

          {/* MOBILE CALL TO ACTIONS (GUEST) */}
          {!isAuthenticated && (
            <div className="pt-2 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login/farmer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-center font-black text-xs shadow-md shadow-emerald-600/20 active:scale-98 flex items-center justify-center space-x-1.5"
                >
                  <span>🌾</span>
                  <span>{t('farmer_login_btn', 'Farmer Login')}</span>
                </Link>
                <Link
                  to="/login/buyer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 bg-slate-900 text-white rounded-xl text-center font-black text-xs shadow-md active:scale-98 flex items-center justify-center space-x-1.5"
                >
                  <span>🏪</span>
                  <span>{t('buyer_login_btn', 'Buyer Login')}</span>
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                <span>{t('direct_portals', 'Direct Portals:')}</span>
                <div className="flex space-x-3">
                  <Link to="/fpo" onClick={() => setMobileMenuOpen(false)} className="text-emerald-700 hover:underline">
                    🏛️ FPO Hub
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

