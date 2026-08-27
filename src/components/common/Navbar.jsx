import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { KrishakLogo } from './KrishakLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationDropdown } from './NotificationDropdown';

import { marketService } from '../../services/marketService';

export const Navbar = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, logout } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [tickerItems, setTickerItems] = useState([]);
  const [userLocationName, setUserLocationName] = useState('Maharashtra Agri Hub');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Dynamic Geolocation & Distance-Adjusted Live Ticker Ingestion
  useEffect(() => {
    let isMounted = true;

    const loadTickerData = async (coords = null) => {
      try {
        const feed = await marketService.getLiveTickerFeed(coords);
        if (isMounted && Array.isArray(feed) && feed.length > 0) {
          setTickerItems(feed);
        }
      } catch (err) {
        console.warn('Error loading ticker feed:', err);
      }
    };

    loadTickerData();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isMounted) {
            setUserLocationName('Geo-Located (Pune/Nashik)');
            loadTickerData({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          }
        },
        () => {},
        { timeout: 4000 }
      );
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#krishak-profile-container')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setProfileDropdownOpen(false);
      await logout();
      if (showToast) showToast('Signed out of KRISHAK session', 'info');
      navigate('/');
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 select-none ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)]'
          : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs'
      }`}
    >
      {/* 1. TOP LIVE MULTI-CHANNEL NET-PRICE APMC & BUYER TICKER STREAM */}
      <div className="bg-slate-950 text-white text-[11px] font-mono py-1.5 px-4 overflow-hidden border-b border-slate-800/80 flex items-center">
        <div className="flex-shrink-0 flex items-center space-x-1.5 mr-3 bg-emerald-950 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 z-10 shadow-xs">
          <span className="live-dot"></span>
          <span className="uppercase text-[9.5px] tracking-wider">LIVE NET FEED ({userLocationName})</span>
        </div>
        
        <div className="flex whitespace-nowrap overflow-hidden w-full">
          <div className="inline-flex space-x-6 animate-marquee">
            {tickerItems.length > 0 ? (
              tickerItems.map((item, idx) => (
                <React.Fragment key={item.id || idx}>
                  <span className="text-slate-300">
                    <span className="text-[10px] bg-slate-800 text-emerald-300 font-bold px-1.5 py-0.5 rounded mr-1">
                      {item.badge}
                    </span>
                    {item.channelName}: Gross ₹{item.grossRateKg}/kg →{' '}
                    <strong className="text-emerald-400 font-bold">Net ₹{item.netRateKg}/kg</strong>{' '}
                    <span className="text-emerald-400 font-bold">({item.changePercent})</span>{' '}
                    <span className="text-harvest-300 font-medium">| {item.advice}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="text-slate-300">🏢 Lasalgaon APMC (120km): Gross ₹18.20 → <strong className="text-emerald-400">Net ₹16.20/kg (-₹2.00 freight & cess)</strong> <span className="text-emerald-400 font-bold">(+5.2%)</span> <span className="text-harvest-300">| Hold 2 Days Advice 📈</span></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">🏭 AgroFresh Corporate Hub: <strong className="text-emerald-400">Net ₹18.80/kg (Farm-Gate Zero Freight)</strong> <span className="text-emerald-400 font-bold">(+3.8%)</span></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">🌾 MahaAgro FPO Tender (15km): <strong className="text-harvest-400">Net ₹47.35/kg (Collective Bulk Rate)</strong></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">🛡️ 100% Escrow Guaranteed Settlements</span>
                <span className="text-slate-600">•</span>
              </>
            )}
          </div>
          <div className="inline-flex space-x-6 animate-marquee" aria-hidden="true">
            {tickerItems.length > 0 ? (
              tickerItems.map((item, idx) => (
                <React.Fragment key={`dup-${item.id || idx}`}>
                  <span className="text-slate-300">
                    <span className="text-[10px] bg-slate-800 text-emerald-300 font-bold px-1.5 py-0.5 rounded mr-1">
                      {item.badge}
                    </span>
                    {item.channelName}: Gross ₹{item.grossRateKg}/kg →{' '}
                    <strong className="text-emerald-400 font-bold">Net ₹{item.netRateKg}/kg</strong>{' '}
                    <span className="text-emerald-400 font-bold">({item.changePercent})</span>{' '}
                    <span className="text-harvest-300 font-medium">| {item.advice}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="text-slate-300">🏢 Lasalgaon APMC (120km): Gross ₹18.20 → <strong className="text-emerald-400">Net ₹16.20/kg (-₹2.00 freight & cess)</strong> <span className="text-emerald-400 font-bold">(+5.2%)</span> <span className="text-harvest-300">| Hold 2 Days Advice 📈</span></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">🏭 AgroFresh Corporate Hub: <strong className="text-emerald-400">Net ₹18.80/kg (Farm-Gate Zero Freight)</strong> <span className="text-emerald-400 font-bold">(+3.8%)</span></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">🌾 MahaAgro FPO Tender (15km): <strong className="text-harvest-400">Net ₹47.35/kg (Collective Bulk Rate)</strong></span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">🛡️ 100% Escrow Guaranteed Settlements</span>
                <span className="text-slate-600">•</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        
        {/* BRAND LOGO */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Link
            to={isAuthenticated ? (isAdmin ? '/admin' : isFarmer ? '/farmer/dashboard' : '/buyer/dashboard') : '/'}
            className="flex items-center focus:outline-none group"
            aria-label="KRISHAK Home"
          >
            <KrishakLogo size="normal" showTagline={true} />
          </Link>
        </div>

        {/* AUTHENTICATED FARMER DESKTOP NAV */}
        {isAuthenticated && isFarmer && (
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-extrabold shadow-inner">
            <Link
              to="/farmer/dashboard"
              className={`px-3.5 py-2 rounded-xl transition-all ${
                isCurrentActive('/farmer/dashboard')
                  ? 'bg-white text-emerald-950 shadow-sm font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/farmer/list-produce"
              className="btn-shimmer px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white shadow-md shadow-emerald-600/25 font-black transition-all flex items-center space-x-1"
            >
              <span>+ List Produce</span>
            </Link>
            <Link
              to="/farmer/best-deal"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1 ${
                isCurrentActive('/farmer/best-deal')
                  ? 'bg-harvest-100 text-harvest-950 border border-harvest-300 font-black shadow-xs'
                  : 'bg-harvest-50 text-harvest-800 hover:bg-harvest-100/80'
              }`}
            >
              <span>🏆</span>
              <span>Best Deal</span>
            </Link>
            <Link
              to="/farmer/markets"
              className={`px-3.5 py-2 rounded-xl transition-all ${
                isCurrentActive('/farmer/markets')
                  ? 'bg-white text-emerald-950 shadow-sm font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              Mandi Rates
            </Link>
            <Link
              to="/farmer/offers"
              className={`px-3.5 py-2 rounded-xl transition-all ${
                isCurrentActive('/farmer/offers')
                  ? 'bg-white text-emerald-950 shadow-sm font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              Buyer Bids
            </Link>
          </nav>
        )}

        {/* AUTHENTICATED BUYER DESKTOP NAV */}
        {isAuthenticated && isBuyer && (
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-extrabold shadow-inner">
            <Link
              to="/buyer/dashboard"
              className={`px-3.5 py-2 rounded-xl transition-all ${
                isCurrentActive('/buyer/dashboard')
                  ? 'bg-white text-blue-950 shadow-sm font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              Procurement Desk
            </Link>
            <Link
              to="/buyer/find-farmers"
              className={`px-3.5 py-2 rounded-xl transition-all ${
                isCurrentActive('/buyer/find-farmers')
                  ? 'bg-white text-blue-950 shadow-sm font-black'
                  : 'text-slate-700 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              Find Farmers
            </Link>
            <Link
              to="/buyer/post-requirement"
              className="btn-shimmer px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 text-white shadow-md shadow-blue-600/25 font-black transition-all flex items-center space-x-1"
            >
              <span>+ Post Tender</span>
            </Link>
          </nav>
        )}

        {/* RIGHT ACTION CONTROLS - REBALANCED, PROFILE AVATAR & LOGOUT */}
        <div className="flex items-center space-x-3">
          
          {/* UTILITY CONTROLS: LANGUAGE & NOTIFICATIONS */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <NotificationDropdown />
          </div>

          {/* VERTICAL SEPARATOR */}
          <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

          {!isAuthenticated ? (
            /* SINGLE CLEAN SIGN IN BUTTON FOR GUESTS */
            <div className="hidden sm:flex items-center">
              <Link
                to="/login/farmer"
                className="btn-shimmer px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
              >
                <span>Sign In</span>
                <span className="text-emerald-200">→</span>
              </Link>
            </div>
          ) : (
            /* AUTHENTICATED USER PROFILE DROPDOWN & LOGOUT BUTTON */
            <div className="flex items-center space-x-2.5 relative" id="krishak-profile-container">
              
              {/* PROFILE PILL BUTTON */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 pl-2 py-1 pr-3 bg-slate-100 hover:bg-slate-200/80 rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs transition-all cursor-pointer group"
                aria-expanded={profileDropdownOpen}
              >
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                    isAdmin
                      ? 'bg-slate-900 text-emerald-400'
                      : isFarmer
                      ? 'bg-emerald-600 text-white font-black'
                      : 'bg-blue-600 text-white font-black'
                  }`}
                >
                  {isAdmin ? '⚙️' : isFarmer ? '🌾' : '🏪'}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-xs font-black text-slate-900 max-w-[110px] truncate">
                    {isAdmin ? 'SuperAdmin' : user?.name || user?.businessName || 'User'}
                  </div>
                  <div
                    className={`text-[9.5px] font-mono font-extrabold capitalize ${
                      isAdmin ? 'text-emerald-700' : isFarmer ? 'text-emerald-700' : 'text-blue-700'
                    }`}
                  >
                    {user?.role || (isFarmer ? 'Farmer' : 'Buyer')}
                  </div>
                </div>
                <span className="text-slate-400 text-xs group-hover:text-slate-700 transition-transform">
                  {profileDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* DIRECT LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                title="Sign out of your account"
                className="p-2.5 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <span>🚪</span>
                <span className="hidden lg:inline text-[11px]">Logout</span>
              </button>

              {/* FLOATING PROFILE DROPDOWN MENU */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 mt-2 w-72 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-fade-in-up space-y-2 text-xs">
                  
                  {/* DROPDOWN USER HEADER */}
                  <div className="px-4 py-3 bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-b border-slate-100 flex items-center space-x-3 rounded-t-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-700/20">
                      {isFarmer ? '🌾' : isBuyer ? '🏪' : '⚙️'}
                    </div>
                    <div className="leading-tight flex-1 min-w-0">
                      <div className="font-extrabold text-slate-900 text-sm truncate">
                        {user?.name || user?.businessName || (isFarmer ? 'Rahul Jadhav' : 'AgroFresh')}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate">
                        {user?.mobile || '+91 9876543210'}
                      </div>
                      <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        ✓ Verified {isFarmer ? 'Farmer' : 'Buyer'}
                      </span>
                    </div>
                  </div>

                  {/* NAVIGATION LINKS */}
                  <div className="px-2 space-y-1 text-slate-700 font-bold">
                    <Link
                      to={isFarmer ? '/farmer/dashboard' : '/buyer/dashboard'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-950 transition-all"
                    >
                      <span>📊</span>
                      <span>My Dashboard</span>
                    </Link>

                    {isFarmer ? (
                      <>
                        <Link
                          to="/farmer/list-produce"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-950 transition-all"
                        >
                          <span>🌾</span>
                          <span>List New Harvest Lot</span>
                        </Link>
                        <Link
                          to="/farmer/best-deal"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-950 transition-all"
                        >
                          <span>🏆</span>
                          <span>Profit Optimizer</span>
                        </Link>
                        <Link
                          to="/farmer/offers"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-950 transition-all"
                        >
                          <span>🏢</span>
                          <span>Buyer Procurement Bids</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/buyer/find-farmers"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-950 transition-all"
                        >
                          <span>👨‍🌾</span>
                          <span>Find Verified Farmers</span>
                        </Link>
                        <Link
                          to="/buyer/post-requirement"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-950 transition-all"
                        >
                          <span>📝</span>
                          <span>Post Sourcing Tender</span>
                        </Link>
                      </>
                    )}

                    <Link
                      to={isFarmer ? '/farmer/transactions' : '/buyer/shipments'}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-950 transition-all"
                    >
                      <span>🛡️</span>
                      <span>Escrow Payouts & Safety</span>
                    </Link>

                    <Link
                      to="/splash"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-amber-50 hover:text-amber-900 transition-all text-amber-800"
                    >
                      <span>✨</span>
                      <span>Replay Animated Intro</span>
                    </Link>
                  </div>

                  {/* LOGOUT BUTTON */}
                  <div className="px-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black transition-all cursor-pointer"
                    >
                      <span>🚪</span>
                      <span>Sign Out of KRISHAK</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-100 text-slate-800 text-lg flex items-center justify-center lg:hidden transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

      </div>

      {/* 3. MOBILE SLIDE-DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-t border-slate-200 px-4 py-5 shadow-2xl space-y-4 animate-slide-down">
          {!isAuthenticated ? (
            <div className="space-y-3">
              <Link
                to="/login/farmer"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-xs font-black text-center shadow-md flex items-center justify-center space-x-1.5"
              >
                <span>Sign In</span>
                <span>→</span>
              </Link>

              <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 pt-2">
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full py-3 text-left flex items-center justify-between hover:text-emerald-900"
                >
                  <span>How It Works</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => scrollToSection('market-intelligence')}
                  className="w-full py-3 text-left flex items-center justify-between hover:text-emerald-900"
                >
                  <span>Mandi Intelligence</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => scrollToSection('ai-insights')}
                  className="w-full py-3 text-left flex items-center justify-between hover:text-emerald-900"
                >
                  <span>Profit Optimizer</span>
                  <span>→</span>
                </button>
                <Link
                  to="/buyer/find-farmers"
                  className="w-full py-3 text-left flex items-center justify-between hover:text-slate-900 block"
                >
                  <span>Direct Sourcing</span>
                  <span>→</span>
                </Link>
                <Link
                  to="/fpo"
                  className="w-full py-3 text-left flex items-center justify-between hover:text-emerald-900 block"
                >
                  <span>FPO Hub</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs font-extrabold">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{isFarmer ? '🌾' : '🏪'}</span>
                  <div>
                    <div className="font-black text-slate-900">{user?.name || user?.businessName}</div>
                    <div className="text-[10px] text-emerald-700 capitalize font-mono">{user?.role} Portal</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl font-black text-[11px] border border-rose-200"
                >
                  Logout
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {isFarmer ? (
                  <>
                    <Link to="/farmer/dashboard" className="p-3 bg-slate-100 rounded-xl text-center">Dashboard</Link>
                    <Link to="/farmer/best-deal" className="p-3 bg-emerald-50 text-emerald-900 font-black rounded-xl text-center">🏆 Best Deal</Link>
                    <Link to="/farmer/markets" className="p-3 bg-slate-100 rounded-xl text-center">Mandi Rates</Link>
                    <Link to="/farmer/offers" className="p-3 bg-slate-100 rounded-xl text-center">Buyer Bids</Link>
                  </>
                ) : (
                  <>
                    <Link to="/buyer/dashboard" className="p-3 bg-slate-100 rounded-xl text-center">Dashboard</Link>
                    <Link to="/buyer/find-farmers" className="p-3 bg-blue-50 text-blue-900 font-black rounded-xl text-center">Find Farmers</Link>
                    <Link to="/buyer/post-requirement" className="p-3 bg-slate-100 rounded-xl text-center">Post Tender</Link>
                    <Link to="/buyer/shipments" className="p-3 bg-slate-100 rounded-xl text-center">Orders</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
