import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { marketService } from '../../services/marketService';
import { NotificationDropdown } from './NotificationDropdown';

/* ── SQUARE-ROUNDED KRISHAK LOGO ───────────────────────────── */
const NavLogo = () => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      {/* Square logo with curved edges (rounded-xl) */}
      <div className="relative h-11 w-11 rounded-xl overflow-hidden border-2 border-emerald-500/70 shadow-md bg-white flex-shrink-0 group-hover:border-emerald-400 group-hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center p-0.5">
        {!imgError ? (
          <img
            src="/krishak_logo.png"
            alt="Krishak Logo"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-700 text-white font-black text-lg">
            🌾
          </div>
        )}
        <div className="absolute inset-0 rounded-xl bg-emerald-300/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Brand wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1">
          <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors leading-none">
            KRISHAK
          </span>
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-sm" />
        </div>
        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wide mt-0.5 flex items-center gap-0.5">
          WE LOVE MAXIMIZING PROFIT <span className="text-amber-500">🌾</span>
        </span>
      </div>
    </div>
  );
};

/* ── LANGUAGE GLOBE BUTTON ─────────────────────────────────── */
const LangButton = () => {
  const [open, setOpen] = useState(false);
  const ctx = useLanguage ? useLanguage() : {};
  const language = ctx.language || 'en';
  const setLanguage = ctx.setLanguage || (() => {});
  const langs = [
    { code: 'en', label: 'English (EN)' },
    { code: 'mr', label: 'मराठी (MR)' },
    { code: 'hi', label: 'हिन्दी (HI)' },
  ];

  useEffect(() => {
    const h = (e) => {
      if (!e.target.closest('#lang-btn-wrap')) setOpen(false);
    };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const displayLabel = language === 'mr' ? 'मराठी (MR)' : language === 'hi' ? 'हिन्दी (HI)' : 'English (EN)';

  return (
    <div className="relative" id="lang-btn-wrap">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 h-10 rounded-xl bg-slate-100/90 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
      >
        <span className="text-base text-blue-500">🌐</span>
        <span className="hidden sm:inline font-semibold">{displayLabel}</span>
        <svg
          className={`w-3 h-3 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in-up text-xs"
          style={{ backgroundColor: '#ffffff' }}
        >
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-900 transition-all cursor-pointer ${
                language === l.code ? 'text-emerald-700 bg-emerald-50 font-black' : 'text-slate-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── MAIN NAVBAR ─────────────────────────────────────────── */
export const Navbar = () => {
  const langCtx = useLanguage ? useLanguage() : {};
  const language = langCtx.language || 'en';
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, logout } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tickerItems, setTickerItems] = useState([]);
  const [userLocationName, setUserLocationName] = useState('Maharashtra Agri Hub');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#krishak-profile-container')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Distance-adjusted Net price ticker
  useEffect(() => {
    let isMounted = true;
    const loadTicker = async (coords = null) => {
      try {
        const feed = await marketService.getLiveTickerFeed(coords);
        if (isMounted && Array.isArray(feed) && feed.length > 0) {
          setTickerItems(feed);
        }
      } catch (err) {
        console.warn('Ticker load error:', err);
      }
    };

    loadTicker();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isMounted) {
            setUserLocationName('Geo-Located (Pune/Nashik)');
            loadTicker({ lat: pos.coords.latitude, lng: pos.coords.longitude });
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

  const handleLogout = async () => {
    try {
      setProfileOpen(false);
      await logout();
      if (showToast) showToast('Signed out of KRISHAK session', 'info');
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
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

  const isActive = (path) => location.pathname === path;

  /* Nav Links for Farmer & Buyer */
  const farmerNavItems = [
    { label: language === 'mr' ? 'मुख्य पान' : 'Landing Page', to: '/', icon: '🏠', type: 'plain' },
    { label: language === 'mr' ? 'डॅशबोर्ड' : 'Dashboard', to: '/farmer/dashboard', icon: '📊', type: 'plain' },
    { label: language === 'mr' ? '+ पीक नोंदणी' : '+ List Produce', to: '/farmer/list-produce', icon: null, type: 'pill-green' },
    { label: language === 'mr' ? 'सर्वोत्तम सौदा' : 'Best Deal', to: '/farmer/best-deal', icon: '🏆', type: 'badge-gold' },
    { label: language === 'mr' ? 'मंडी भाव' : 'Mandi Rate', to: '/farmer/markets', icon: '🏷️', type: 'plain' },
    { label: language === 'mr' ? 'खरेदीदार बोली' : 'Buyer Bids', to: '/farmer/offers', icon: '⚖️', type: 'plain' },
  ];

  const buyerNavItems = [
    { label: 'Landing Page', to: '/', icon: '🏠', type: 'plain' },
    { label: 'Dashboard', to: '/buyer/dashboard', icon: '📊', type: 'plain' },
    { label: '+ Post Tender', to: '/buyer/post-requirement', icon: null, type: 'pill-blue' },
    { label: 'Best Deals', to: '/buyer/find-farmers', icon: '🏆', type: 'badge-gold' },
    { label: 'Find Farmers', to: '/buyer/find-farmers', icon: '👨‍🌾', type: 'plain' },
    { label: 'Buyer Orders', to: '/buyer/shipments', icon: '📦', type: 'plain' },
  ];

  const navItems = isAuthenticated ? (isFarmer ? farmerNavItems : buyerNavItems) : [];

  // Hide entire navbar when map modal is open to ensure 100% immersive clear map view
  const [mapModalActive, setMapModalActive] = useState(false);
  useEffect(() => {
    const handleMapToggle = (e) => {
      setMapModalActive(Boolean(e.detail?.open));
    };
    window.addEventListener('krishak-map-modal-toggle', handleMapToggle);
    return () => window.removeEventListener('krishak-map-modal-toggle', handleMapToggle);
  }, []);

  if (mapModalActive) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 select-none ${
        scrolled
          ? 'bg-white/98 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.10)]'
          : 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs'
      }`}
    >
      {/* ── 1. TOP LIVE MULTI-CHANNEL TICKER STREAM ── */}
      <div className="bg-slate-950 text-white text-[11px] font-mono py-1.5 px-4 overflow-hidden border-b border-slate-800/80 flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-950 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 z-10 shadow-xs">
          <span className="live-dot" />
          <span className="uppercase text-[9.5px] tracking-wider">LIVE NET FEED ({userLocationName})</span>
        </div>

        <div className="flex whitespace-nowrap overflow-hidden w-full">
          {[0, 1].map((dup) => (
            <div key={dup} className="inline-flex gap-6 animate-marquee" aria-hidden={dup === 1 ? 'true' : undefined}>
              {tickerItems.length > 0 ? (
                tickerItems.map((item, idx) => (
                  <React.Fragment key={`${dup}-${item.id || idx}`}>
                    <span className="text-slate-300">
                      <span className="text-[10px] bg-slate-800 text-emerald-300 font-bold px-1.5 py-0.5 rounded mr-1">
                        {item.badge}
                      </span>
                      {item.channelName}: Gross ₹{item.grossRateKg}/kg →{' '}
                      <strong className="text-emerald-400 font-bold">Net ₹{item.netRateKg}/kg</strong>{' '}
                      <span className="text-emerald-400 font-bold">({item.changePercent})</span>{' '}
                      <span className="text-amber-300 font-medium">| {item.advice}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                  </React.Fragment>
                ))
              ) : (
                <>
                  <span className="text-slate-300">
                    🏢 Lasalgaon APMC (120km): Gross ₹18.20 → <strong className="text-emerald-400">Net ₹16.20/kg</strong>{' '}
                    <span className="text-emerald-400 font-bold">(+5.2%)</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">
                    🏭 AgroFresh Hub: <strong className="text-emerald-400">Net ₹18.80/kg (Farm-Gate)</strong>{' '}
                    <span className="text-emerald-400 font-bold">(+3.8%)</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">
                    🌾 MahaAgro FPO: <strong className="text-amber-300">Net ₹47.35/kg Bulk Rate</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">🛡️ 100% Escrow Guaranteed Settlements</span>
                  <span className="text-slate-600">•</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. MAIN NAVBAR ROW ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* LEFT: BRAND LOGO (Square with curved edges) */}
        <Link
          to={isAuthenticated ? (isAdmin ? '/admin' : isFarmer ? '/farmer/dashboard' : '/buyer/dashboard') : '/'}
          aria-label="KRISHAK Home"
          className="flex-shrink-0"
        >
          <NavLogo />
        </Link>

        {/* CENTER: COMBINED PILL NAVIGATION BAR (Uniform height & sizing for all items) */}
        {isAuthenticated && navItems.length > 0 && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/90 shadow-inner h-11">
            {navItems.map((item, idx) => {
              if (item.type === 'pill-green') {
                return (
                  <Link
                    key={item.to + idx}
                    to={item.to}
                    className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs shadow-sm shadow-emerald-700/25 whitespace-nowrap transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              }

              if (item.type === 'pill-blue') {
                return (
                  <Link
                    key={item.to + idx}
                    to={item.to}
                    className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs shadow-sm shadow-blue-700/25 whitespace-nowrap transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              }

              if (item.type === 'badge-gold') {
                return (
                  <Link
                    key={item.to + idx}
                    to={item.to}
                    className={`flex items-center justify-center gap-1.5 px-3.5 h-9 rounded-full bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 hover:from-amber-200 hover:to-amber-400 text-amber-950 font-black text-xs border border-amber-300/90 shadow-xs whitespace-nowrap transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      isActive(item.to) ? 'ring-2 ring-amber-500' : ''
                    }`}
                  >
                    <span className="text-sm leading-none">🏆</span>
                    <span>{item.label}</span>
                  </Link>
                );
              }

              // Plain text navigation items with subtle separator borders
              return (
                <React.Fragment key={item.to + idx}>
                  {idx > 0 && <div className="h-4 w-px bg-slate-300/80 mx-0.5" />}
                  <Link
                    to={item.to}
                    className={`flex items-center justify-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive(item.to)
                        ? 'bg-white text-slate-950 font-black shadow-xs'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-white/70'
                    }`}
                  >
                    {item.icon && <span className="text-sm leading-none">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Spacer for guests on desktop */}
        {!isAuthenticated && <div className="flex-1" />}

        {/* RIGHT CONTROLS: LANGUAGE SWITCHER, NOTIFICATION DROPDOWN, PROFILE PILL */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <LangButton />

          {/* Fully Interactive Aesthetic Notification Dropdown */}
          <NotificationDropdown />

          {/* Vertical Separator */}
          <div className="hidden sm:block h-7 w-px bg-slate-200 mx-0.5" />

          {!isAuthenticated ? (
            <Link
              to="/login/farmer"
              className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-700/25 transition-all"
            >
              Sign In →
            </Link>
          ) : (
            /* USER PROFILE AVATAR PILL */
            <div className="relative" id="krishak-profile-container">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2.5 pl-1.5 pr-3.5 h-10 border rounded-full transition-all cursor-pointer group shadow-xs ${
                  profileOpen
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 shadow-sm'
                    : 'bg-slate-100/90 hover:bg-slate-200/90 border-slate-200 hover:border-emerald-300'
                }`}
                aria-expanded={profileOpen}
              >
                {/* Farmer / Buyer Avatar Photo with border */}
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0 ${
                    isAdmin
                      ? 'bg-slate-900 text-emerald-400'
                      : isFarmer
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                      : 'bg-blue-600 text-white ring-2 ring-blue-300'
                  }`}
                >
                  {isAdmin ? '⚙️' : isFarmer ? '🌾' : '🏪'}
                </div>

                {/* Name and Role Subtitle */}
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-black text-slate-900 max-w-[110px] truncate">
                    {isAdmin ? 'SuperAdmin' : user?.name || user?.businessName || 'Rahul Jadhav'}
                  </span>
                  <span
                    className={`text-[9.5px] font-bold capitalize ${
                      isAdmin ? 'text-emerald-700' : isFarmer ? 'text-emerald-700' : 'text-blue-700'
                    }`}
                  >
                    Verified {isFarmer ? 'Farmer' : isAdmin ? 'Admin' : 'Buyer'}
                  </span>
                </div>

                <svg
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${
                    profileOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 100% SOLID NON-TRANSPARENT PROFILE DROPDOWN MENU */}
              {profileOpen && (
                <div
                  className="absolute right-0 top-13 mt-1 w-72 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.30)] border-2 border-slate-200 py-3 z-[100] animate-fade-in-up text-xs overflow-hidden"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  {/* User Profile Header (Solid Dark Opaque) */}
                  <div className="mx-2 p-3.5 bg-slate-900 text-white rounded-2xl flex items-center gap-3 border border-slate-800 shadow-xs">
                    <div
                      className={`h-11 w-11 rounded-2xl flex items-center justify-center text-xl font-black shadow-md flex-shrink-0 ${
                        isFarmer ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                      }`}
                    >
                      {isFarmer ? '🌾' : isBuyer ? '🏪' : '⚙️'}
                    </div>
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="font-extrabold text-white text-sm truncate">
                        {user?.name || user?.businessName || (isFarmer ? 'Rahul Jadhav' : 'AgroFresh')}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate mt-0.5">{user?.mobile || '+91 9876543210'}</div>
                      <span className="inline-block mt-1 text-[9px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                        ✓ Verified {isFarmer ? 'Farmer' : 'Buyer'}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links (Solid Opaque White Background) */}
                  <div className="px-2 pt-2.5 space-y-0.5 font-bold text-slate-700 bg-white" style={{ backgroundColor: '#ffffff' }}>
                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-950 transition-all cursor-pointer text-emerald-900 font-extrabold"
                    >
                      <span className="text-sm">🏠</span>
                      <span>{language === 'mr' ? 'मुख्य पान (Landing Page)' : 'Public Landing Page'}</span>
                    </Link>

                    <Link
                      to={isFarmer ? '/farmer/dashboard' : '/buyer/dashboard'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-emerald-950 transition-all cursor-pointer"
                    >
                      <span className="text-sm">📊</span>
                      <span>My Dashboard</span>
                    </Link>

                    {isFarmer ? (
                      <>
                        <Link
                          to="/farmer/list-produce"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-emerald-950 transition-all cursor-pointer"
                        >
                          <span className="text-sm">🌾</span>
                          <span>List New Harvest</span>
                        </Link>
                        <Link
                          to="/farmer/best-deal"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-amber-50 hover:text-amber-900 transition-all cursor-pointer"
                        >
                          <span className="text-sm">🏆</span>
                          <span>Profit Optimizer</span>
                        </Link>
                        <Link
                          to="/farmer/offers"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-emerald-950 transition-all cursor-pointer"
                        >
                          <span className="text-sm">🏢</span>
                          <span>Buyer Bids</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/buyer/find-farmers"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-900 transition-all cursor-pointer"
                        >
                          <span className="text-sm">👨‍🌾</span>
                          <span>Find Verified Farmers</span>
                        </Link>
                        <Link
                          to="/buyer/post-requirement"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-900 transition-all cursor-pointer"
                        >
                          <span className="text-sm">📝</span>
                          <span>Post Sourcing Tender</span>
                        </Link>
                      </>
                    )}

                    <Link
                      to={isFarmer ? '/farmer/transactions' : '/buyer/shipments'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-100 hover:text-emerald-950 transition-all cursor-pointer"
                    >
                      <span className="text-sm">🛡️</span>
                      <span>Escrow &amp; Payouts</span>
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="px-2 pt-2 border-t border-slate-100 mt-1 bg-white" style={{ backgroundColor: '#ffffff' }}>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black transition-all cursor-pointer"
                    >
                      <span>🚪</span>
                      <span>Sign Out of KRISHAK</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:border-emerald-300 text-slate-800 text-lg flex items-center justify-center lg:hidden transition-all active:scale-95 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* ── 3. MOBILE SLIDE-DOWN DRAWER ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden bg-white border-t border-slate-200 px-4 py-5 shadow-2xl space-y-4 animate-slide-down"
          style={{ backgroundColor: '#ffffff' }}
        >
          {!isAuthenticated ? (
            <div className="space-y-3">
              <Link
                to="/login/farmer"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-xs font-black text-center shadow-md flex items-center justify-center gap-1.5"
              >
                Sign In →
              </Link>
              <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 pt-2">
                {[
                  ['How It Works', 'how-it-works'],
                  ['Mandi Intelligence', 'market-intelligence'],
                  ['Profit Optimizer', 'ai-insights'],
                ].map(([label, id]) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="w-full py-3 text-left flex items-center justify-between hover:text-emerald-900"
                  >
                    <span>{label}</span>
                    <span>→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs font-extrabold">
              {/* User badge */}
              <div className="p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{isFarmer ? '🌾' : '🏪'}</span>
                  <div>
                    <div className="font-black text-white">{user?.name || user?.businessName}</div>
                    <div className="text-[10px] text-emerald-400 capitalize font-mono">{user?.role} Portal</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl font-black text-[11px] border border-rose-400/40 cursor-pointer transition-all"
                >
                  Logout
                </button>
              </div>

              {/* Navigation Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="col-span-2 p-3 rounded-xl text-center font-black text-xs bg-emerald-50 text-emerald-950 border border-emerald-200 flex items-center justify-center gap-2"
                >
                  <span>🏠</span>
                  <span>{language === 'mr' ? 'मुख्य पान (Landing Page)' : 'Return to Landing Page'}</span>
                </Link>
                {navItems.map((item, idx) => (
                  <Link
                    key={item.to + idx}
                    to={item.to}
                    className={`p-3 rounded-xl text-center font-bold text-xs ${
                      item.type === 'pill-green'
                        ? 'bg-emerald-600 text-white font-black'
                        : item.type === 'pill-blue'
                        ? 'bg-blue-600 text-white font-black'
                        : item.type === 'badge-gold'
                        ? 'bg-amber-100 text-amber-900 font-black border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
