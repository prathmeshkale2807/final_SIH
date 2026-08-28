import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { KrishakLogo } from '../common/KrishakLogo';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

import { NotificationDropdown } from '../common/NotificationDropdown';

export const BuyerLayout = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      if (showToast) showToast('Logged out successfully');
      navigate('/');
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  const navItems = [
    { label: t('nav_home', 'Dashboard'), path: '/buyer/dashboard', icon: 'ri-dashboard-line' },
    { label: t('nav_post', 'Post Procurement Tender'), path: '/buyer/post-requirement', icon: 'ri-add-circle-line', primary: true },
    { label: t('nav_search', 'Find Farmers Lots'), path: '/buyer/find-farmers', icon: 'ri-user-search-line' },
    { label: t('nav_orders', 'Orders & Escrow'), path: '/buyer/shipments', icon: 'ri-truck-line' },
    { label: 'FPO Collective Sourcing', path: '/fpo', icon: 'ri-community-line' },
    { label: t('nav_profile', 'Enterprise Profile'), path: '/buyer/profile', icon: 'ri-store-2-line' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">
      
      {/* ========================================================================= */}
      {/* DESKTOP FIXED LEFT SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 fixed inset-y-0 left-0 z-30 shadow-xs">
        {/* LOGO AT TOP OF SIDEBAR */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100/90">
          <Link to="/" className="flex items-center" title="KRISHAK - Return to Landing Page">
            <KrishakLogo size="normal" showTagline={true} />
          </Link>
        </div>

        {/* RETURN TO LANDING PAGE CHIP */}
        <div className="px-4 pt-3 pb-1">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 bg-blue-50/70 hover:bg-blue-100/80 text-blue-900 border border-blue-200/80 rounded-xl text-xs font-black transition-all group"
            title="Return to Public Landing Page"
          >
            <div className="flex items-center space-x-2">
              <span className="text-blue-700 font-black group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>{language === 'mr' ? 'मुख्य पानावर जा' : 'Landing Page'}</span>
            </div>
            <span className="text-[9px] font-mono font-bold bg-white/90 text-blue-800 px-1.5 py-0.5 rounded border border-blue-300 shadow-2xs">
              HOME
            </span>
          </Link>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <div className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>Procurement Portal</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          </div>

          {navItems.map((item, idx) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  item.primary
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-600/25 font-black hover:scale-[1.01] active:scale-95'
                    : isActive
                    ? 'bg-blue-50 text-blue-950 border border-blue-200/90 font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i className={`${item.icon} text-lg transition-transform group-hover:scale-110 ${
                    item.primary ? 'text-white' : isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'
                  }`}></i>
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* USER PROFILE & LOGOUT CHIP AT BOTTOM */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
              🏪
            </div>
            <div className="overflow-hidden text-left leading-tight">
              <div className="text-xs font-black text-slate-900 truncate">{user?.businessName || user?.name || 'AgroFresh Food'}</div>
              <div className="text-[10px] text-blue-700 font-mono font-bold truncate">{user?.id || 'BUY-2026-PN08'}</div>
            </div>
          </div>

          {/* LOGOUT BUTTON WITH ICON */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-all flex-shrink-0 active:scale-90"
            title="Logout of Buyer Account"
            aria-label="Logout"
          >
            <i className="ri-logout-box-r-line text-lg"></i>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN DESKTOP / MOBILE CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <div className="flex-1 md:pl-64 lg:pl-72 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          
          {/* MOBILE HEADER LEFT: COMPACT LOGO + LANDING LINK */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link to="/" className="flex items-center" title="Return to Landing Page">
              <KrishakLogo size="small" showTagline={false} />
            </Link>
          </div>

          {/* DESKTOP HEADER LEFT: PAGE TITLE / BREADCRUMB + RETURN TO LANDING LINK */}
          <div className="hidden md:flex items-center space-x-3 text-xs text-slate-500 font-medium">
            <Link
              to="/"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-200/90 rounded-xl font-extrabold transition-all shadow-2xs group"
              title="Return to Public Landing Page"
            >
              <span className="text-blue-700 font-black group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>{language === 'mr' ? 'मुख्य पान' : 'Landing Page'}</span>
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-700">KRISHAK</span>
            <span>/</span>
            <span className="text-blue-700 font-black capitalize bg-blue-50/60 px-2.5 py-1 rounded-lg border border-blue-200/60">
              {currentPath.replace('/buyer/', '').replace('/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          {/* HEADER RIGHT: LANDING BUTTON, LANGUAGE, NOTIFICATIONS, LOGOUT BUTTON */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* RETURN TO LANDING PAGE HEADER BUTTON */}
            <Link
              to="/"
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-900 border border-slate-200/90 rounded-xl text-xs font-black text-slate-700 transition-all duration-200 active:scale-95 shadow-2xs"
              title="Return to Public Landing Page"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">{language === 'mr' ? 'मुख्य पान' : 'Landing Page'}</span>
            </Link>

            <LanguageSwitcher />

            <NotificationDropdown />

            {/* UPGRADED LOGOUT BUTTON WITH ICON */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100/90 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200/90 rounded-xl text-xs font-black text-slate-600 transition-all duration-200 active:scale-95 shadow-xs"
              title="Logout"
              aria-label="Logout"
            >
              <i className="ri-logout-box-r-line text-sm sm:text-base text-slate-500 hover:text-rose-600"></i>
              <span className="hidden sm:inline">{t('logout', 'Logout')}</span>
            </button>
          </div>
        </header>

        {/* MAIN APPLICATION OUTLET */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE APP FIXED BOTTOM NAVIGATION (BUYER ONLY) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.06)] safe-bottom">
        <Link
          to="/buyer/dashboard"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/buyer/dashboard' ? 'text-blue-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-dashboard-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_home', 'Home')}</span>
        </Link>

        <Link
          to="/buyer/find-farmers"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/buyer/find-farmers' ? 'text-blue-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-user-search-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_search', 'Find')}</span>
        </Link>

        {/* CENTRAL PROMINENT POST ACTION WITH PULSING RING */}
        <Link
          to="/buyer/post-requirement"
          className="flex flex-col items-center flex-1 py-0.5 text-blue-800 font-black relative group"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white scale-110 shadow-lg shadow-blue-600/35 transition-transform group-hover:scale-125 group-active:scale-95">
            <i className="ri-add-line text-2xl font-bold"></i>
          </div>
          <span className="text-[10px] mt-1 font-black text-blue-800">Post</span>
        </Link>

        <Link
          to="/buyer/shipments"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/buyer/shipments' ? 'text-blue-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-truck-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_orders', 'Orders')}</span>
        </Link>

        <Link
          to="/buyer/profile"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/buyer/profile' ? 'text-blue-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-store-2-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_profile', 'Profile')}</span>
        </Link>
      </nav>

    </div>
  );
};
