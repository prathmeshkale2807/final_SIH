import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav = () => {
  const { t } = useLanguage();
  const { isFarmer, isBuyer } = useAuth();

  const farmerLinks = [
    { to: '/farmer/dashboard', label: t('nav_home', 'Home'), icon: 'ri-home-4-line' },
    { to: '/farmer/markets', label: t('nav_markets', 'Markets'), icon: 'ri-line-chart-line' },
    { to: '/farmer/best-deal', label: t('nav_sell', 'Best Deal'), icon: 'ri-trophy-line', highlight: true },
    { to: '/farmer/offers', label: t('nav_buyers', 'Offers'), icon: 'ri-hand-heart-line' },
    { to: '/farmer/profile', label: t('nav_profile', 'Profile'), icon: 'ri-user-3-line' }
  ];

  const buyerLinks = [
    { to: '/buyer/dashboard', label: t('nav_home', 'Home'), icon: 'ri-dashboard-line' },
    { to: '/buyer/find-farmers', label: t('nav_search', 'Find'), icon: 'ri-user-search-line' },
    { to: '/buyer/post-requirement', label: t('nav_post', 'Post'), icon: 'ri-add-circle-line', highlight: true },
    { to: '/buyer/shipments', label: t('nav_orders', 'Orders'), icon: 'ri-truck-line' },
    { to: '/buyer/profile', label: t('nav_profile', 'Profile'), icon: 'ri-store-2-line' }
  ];

  const links = isFarmer ? farmerLinks : isBuyer ? buyerLinks : [];

  if (links.length === 0) return null;

  const activeColor = isFarmer ? 'text-emerald-700' : 'text-blue-700';
  const activeBg = isFarmer ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700';
  const highlightBg = isFarmer 
    ? 'bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white shadow-lg shadow-emerald-600/30' 
    : 'bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-600/30';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.06)] safe-bottom">
      {links.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
              item.highlight
                ? 'font-black scale-105'
                : isActive
                ? `${activeColor} font-black scale-105`
                : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1.5 rounded-2xl transition-all duration-200 flex items-center justify-center ${
                  item.highlight
                    ? `${highlightBg} scale-110`
                    : isActive
                    ? `${activeBg} shadow-xs`
                    : 'text-slate-500'
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
