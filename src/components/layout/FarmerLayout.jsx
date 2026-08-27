import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { KrishakLogo } from '../common/KrishakLogo';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

import { NotificationDropdown } from '../common/NotificationDropdown';

export const FarmerLayout = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
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
    { label: t('nav_home', 'Dashboard'), path: '/farmer/dashboard', icon: 'ri-dashboard-line' },
    { label: t('nav_sell', 'Sell My Produce'), path: '/farmer/list-produce', icon: 'ri-add-circle-line', primary: true },
    { label: t('nav_deals', 'Best Deal (Profit)'), path: '/farmer/best-deal', icon: 'ri-trophy-line', badge: 'PROFIT' },
    { label: t('nav_markets', 'Market Intelligence'), path: '/farmer/markets', icon: 'ri-line-chart-line' },
    { label: t('nav_lots', 'My Produce Lots'), path: '/farmer/lots', icon: 'ri-archive-line' },
    { label: t('nav_offers', 'Buyer Offers'), path: '/farmer/offers', icon: 'ri-hand-heart-line' },
    { label: t('nav_escrow', 'Escrow & Payouts'), path: '/farmer/transactions', icon: 'ri-shield-check-line' },
    { label: 'FPO Hub', path: '/fpo', icon: 'ri-community-line' },
    { label: t('nav_profile', 'Farmer Profile'), path: '/farmer/profile', icon: 'ri-user-3-line' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row antialiased">
      
      {/* ========================================================================= */}
      {/* DESKTOP FIXED LEFT SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 fixed inset-y-0 left-0 z-30 shadow-xs">
        {/* LOGO AT TOP OF SIDEBAR */}
        <div className="h-20 px-6 flex items-center border-b border-slate-100/90">
          <Link to="/farmer/dashboard" className="flex items-center">
            <KrishakLogo size="normal" showTagline={true} />
          </Link>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>Farmer Portal</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {navItems.map((item, idx) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  item.primary
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md shadow-emerald-600/25 font-black hover:scale-[1.01] active:scale-95'
                    : isActive
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/90 font-black shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <i className={`${item.icon} text-lg transition-transform group-hover:scale-110 ${
                    item.primary ? 'text-white' : isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                  }`}></i>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 bg-gradient-to-r from-harvest-400 to-harvest-500 text-slate-950 rounded-md shadow-xs animate-badge-pop">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* USER PROFILE & LOGOUT CHIP AT BOTTOM */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
              🌾
            </div>
            <div className="overflow-hidden text-left leading-tight">
              <div className="text-xs font-black text-slate-900 truncate">{user?.name || user?.farmerName || 'Farmer'}</div>
              <div className="text-[10px] text-emerald-700 font-mono font-bold truncate">{user?.farmerId || user?.id || user?.mobile || 'Farmer Account'}</div>
            </div>
          </div>
          
          {/* LOGOUT BUTTON WITH ICON */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xl transition-all flex-shrink-0 active:scale-90"
            title="Logout of Farmer Account"
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
          
          {/* MOBILE HEADER LEFT: COMPACT LOGO */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link to="/farmer/dashboard">
              <KrishakLogo size="small" showTagline={false} />
            </Link>
          </div>

          {/* DESKTOP HEADER LEFT: PAGE TITLE / BREADCRUMB */}
          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-700">KRISHAK</span>
            <span>/</span>
            <span className="text-emerald-700 font-black capitalize bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              {currentPath.replace('/farmer/', '').replace('/', '').replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          {/* HEADER RIGHT: LANGUAGE, NOTIFICATIONS, LOGOUT BUTTON */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
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
      {/* MOBILE APP FIXED BOTTOM NAVIGATION (FARMER ONLY) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.06)] safe-bottom">
        <Link
          to="/farmer/dashboard"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/farmer/dashboard' ? 'text-emerald-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-home-4-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_home', 'Home')}</span>
        </Link>

        <Link
          to="/farmer/markets"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/farmer/markets' ? 'text-emerald-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-line-chart-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_markets', 'Markets')}</span>
        </Link>

        {/* CENTRAL PROMINENT SELL ACTION WITH PULSING RING */}
        <Link
          to="/farmer/list-produce"
          className="flex flex-col items-center flex-1 py-0.5 text-emerald-800 font-black relative group"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white scale-110 shadow-lg shadow-emerald-600/35 transition-transform group-hover:scale-125 group-active:scale-95">
            <i className="ri-add-line text-2xl font-bold"></i>
          </div>
          <span className="text-[10px] mt-1 font-black text-emerald-800">Sell</span>
        </Link>

        <Link
          to="/farmer/best-deal"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/farmer/best-deal' ? 'text-harvest-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-trophy-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_deals', 'Deals')}</span>
        </Link>

        <Link
          to="/farmer/profile"
          className={`flex flex-col items-center flex-1 py-1 transition-all ${
            currentPath === '/farmer/profile' ? 'text-emerald-700 font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="ri-user-3-line text-xl"></i>
          <span className="text-[10px] mt-0.5">{t('nav_profile', 'Profile')}</span>
        </Link>
      </nav>

    </div>
  );
};
