import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from '../common/NotificationDropdown';

export const FarmerLayout = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: 'Dashboard', path: '/farmer/dashboard', icon: 'ri-home-4-line', activeIcon: 'ri-home-4-fill' },
    { label: 'Market Intelligence', path: '/farmer/markets', icon: 'ri-line-chart-line' },
    { label: 'My Crops', path: '/farmer/crops', icon: 'ri-plant-line' },
    { label: 'Sell Your Produce', path: '/farmer/list-produce', icon: 'ri-store-2-line' },
    { label: 'Contracts', path: '/farmer/contracts', icon: 'ri-file-list-3-line' },
    { label: 'Orders & Sales', path: '/farmer/orders', icon: 'ri-shopping-cart-line' },
    { label: 'Payments & Wallet', path: '/farmer/wallet', icon: 'ri-wallet-3-line' },
    { label: 'Weather Forecast', path: '/farmer/weather', icon: 'ri-cloud-windy-line' },
    { label: 'Best Deal', path: '/farmer/best-deal', icon: 'ri-trophy-line', badge: 'New' },
    { label: 'Resources', path: '/farmer/resources', icon: 'ri-box-3-line' },
    { label: 'Support', path: '/farmer/support', icon: 'ri-questionnaire-line' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-900 flex antialiased font-sans">
      
      {/* ─── DESKTOP FIXED LEFT SIDEBAR (EXACT MATCH TO REFERENCE) ─── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#062d1f] text-white fixed inset-y-0 left-0 z-30 shadow-2xl overflow-y-auto">
        
        {/* BRAND LOGO & TITLE */}
        <div className="p-6 pb-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-2xl flex-shrink-0">
            🌱
          </div>
          <div>
            <div className="font-black text-lg tracking-wider text-white leading-none">
              KRISHI SETU
            </div>
            <div className="text-[10.5px] font-medium text-emerald-300/80 tracking-wide mt-1">
              Farmer Command Center
            </div>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION LIST */}
        <nav className="flex-1 px-3.5 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            const isActive = currentPath === item.path || (item.path === '/farmer/crops' && currentPath === '/farmer/lots') || (item.path === '/farmer/wallet' && currentPath === '/farmer/transactions');
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#008253] text-white shadow-md shadow-emerald-950/40 font-black'
                    : 'text-emerald-100/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <i className={`${isActive && item.activeIcon ? item.activeIcon : item.icon} text-lg ${isActive ? 'text-white' : 'text-emerald-300/70'}`}></i>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOOST YOUR PROFITS PROMO CARD (EXACT REPLICA) */}
        <div className="p-3.5 pt-1">
          <div 
            className="rounded-3xl p-5 text-slate-900 relative overflow-hidden shadow-md bg-cover bg-bottom border border-emerald-300/30"
            style={{
              backgroundImage: "url('/boost_profit_sprout.jpg')",
              backgroundColor: '#f8faf9',
            }}
          >
            <div className="relative z-10 max-w-[170px]">
              <h4 className="font-black text-base text-[#0d3b22] leading-tight tracking-tight">
                Boost Your Profits
              </h4>
              <p className="text-xs text-[#1e462d] mt-1.5 leading-snug font-medium">
                Use our AI insights and market intelligence to increase your earnings.
              </p>
            </div>

            <button
              onClick={() => navigate('/farmer/advisory')}
              className="mt-4 relative z-10 w-full py-2.5 bg-[#0e5c36] hover:bg-[#094728] active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Insights</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* USER PROFILE PILL AT BOTTOM (EXACT REPLICA) */}
        <div className="p-3.5 border-t border-emerald-900/60 bg-[#042016]/90">
          <div 
            className="flex items-center justify-between p-2.5 rounded-2xl bg-[#063321] border border-emerald-800/60 hover:border-emerald-600/60 transition-all cursor-pointer group" 
            onClick={() => navigate('/farmer/profile')}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="/farmer_avatar.jpg"
                alt="Rahul Jadhav"
                className="h-10 w-10 rounded-full object-cover border-2 border-emerald-400/80 shadow-sm flex-shrink-0"
                onError={(e) => { e.target.src = '/krishak_logo.png'; }}
              />
              <div className="overflow-hidden leading-tight">
                <div className="text-xs font-black text-white truncate">
                  {user?.name || user?.farmerName || 'Rahul Jadhav'}
                </div>
                <div className="text-[11px] text-emerald-300/90 font-medium truncate mt-0.5">
                  Premium Farmer
                </div>
              </div>
            </div>
            
            <i className="ri-arrow-down-s-line text-emerald-300 text-lg group-hover:translate-y-0.5 transition-transform"></i>
          </div>
        </div>

      </aside>

      {/* ─── MAIN CONTENT VIEW (TOP BAR + PAGE CONTENT) ─── */}
      <div className="flex-1 lg:pl-64 xl:pl-72 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP BAR / DESKTOP & MOBILE HEADER */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
          
          {/* Header Left: Hamburger + Greeting */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg"
            >
              <i className={mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
            </button>

            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                <span>Welcome back, {user?.name || user?.farmerName || 'Rahul Jadhav'}</span>
                <span className="text-lg">👋</span>
              </h2>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span>{user?.village ? `${user.village}, ` : ''}{user?.district || 'Ausa, Latur'}</span>
                <span>•</span>
                <span>{user?.landArea ? `${user.landArea} Acres` : '8.5 Acres'}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Market Intelligence Active
                </span>
              </div>
            </div>
          </div>

          {/* Header Right: Search, Notifications, Leaf Icon */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            
            {/* Search Input */}
            <div className="relative hidden md:block w-52 lg:w-64">
              <input
                type="text"
                placeholder="Search market, crop, buyers..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
              />
              <i className="ri-search-line absolute left-3 top-2.5 text-slate-400 text-sm"></i>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <NotificationDropdown />
            </div>

            {/* Green Eco Leaf Action Icon */}
            <button
              onClick={() => navigate('/farmer/best-deal')}
              className="h-10 w-10 rounded-full bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center text-lg shadow-2xs transition-transform active:scale-95 cursor-pointer"
              title="Best Deal"
            >
              🏆
            </button>
          </div>

        </header>

        {/* MOBILE SLIDEOUT DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-[#062d1f] text-white h-full flex flex-col p-4 shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-emerald-900/60">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  <div className="font-black text-base text-white">KRISHI SETU</div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1">
                {navItems.map((item, idx) => {
                  const isActive = currentPath === item.path;
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                        isActive
                          ? 'bg-[#008253] text-white font-black'
                          : 'text-emerald-100/80 hover:bg-white/10'
                      }`}
                    >
                      <i className={`${item.icon} text-lg`}></i>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-rose-950/60 border border-rose-800/60 text-rose-200 rounded-xl text-xs font-bold mt-2"
              >
                Logout
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* PAGE CONTENT OUTLET */}
        <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default FarmerLayout;
