import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

// INITIAL NOTIFICATIONS FOR FARMER / SELLER
const farmerInitialNotifications = [
  {
    id: 'F-NOTIF-1',
    category: 'deals',
    title: 'New Buyer Bid Received',
    message: 'AgroFresh Processors Ltd. offered ₹1,490/q for 60 Quintals Onion (Grade A).',
    time: '5 mins ago',
    unread: true,
    link: '/farmer/offers',
    icon: '🤝',
    badge: 'Buyer Bid',
    color: 'emerald',
  },
  {
    id: 'F-NOTIF-2',
    category: 'mandi',
    title: 'Mandi Rate Spike Alert',
    message: 'Lasalgaon APMC Onion rate jumped +5.2% (Modal: ₹1,820/q). Top selling window open!',
    time: '25 mins ago',
    unread: true,
    link: '/farmer/markets',
    icon: '📈',
    badge: 'Mandi Surge',
    color: 'amber',
  },
  {
    id: 'F-NOTIF-3',
    category: 'escrow',
    title: 'Deal Approved & Warehouse Set',
    message: 'AgroFresh approved your 60Q request. Assigned Drop Warehouse: Bhosari MIDC, Pune.',
    time: '45 mins ago',
    unread: true,
    link: '/farmer/transactions',
    icon: '🏢',
    badge: 'Drop Assigned',
    color: 'blue',
  },
  {
    id: 'F-NOTIF-4',
    category: 'escrow',
    title: 'Escrow Payment Deposited',
    message: '₹89,400 successfully locked in 100% safe escrow for Lot DEAL-2026-901.',
    time: '1 hour ago',
    unread: false,
    link: '/farmer/transactions',
    icon: '🛡️',
    badge: 'Escrow Funded',
    color: 'emerald',
  },
  {
    id: 'F-NOTIF-5',
    category: 'escrow',
    title: 'Escrow Payout Released to Bank',
    message: '₹52,000 released directly to your Bank Account (HDFC Bank •••• 4019).',
    time: '3 hours ago',
    unread: false,
    link: '/farmer/transactions',
    icon: '💰',
    badge: 'Bank Payout',
    color: 'teal',
  },
];

// INITIAL NOTIFICATIONS FOR BUYER / ENTERPRISE TRADER
const buyerInitialNotifications = [
  {
    id: 'B-NOTIF-1',
    category: 'requests',
    title: '⚡ Incoming Farmer Sell Request',
    message: 'Rahul Jadhav requested direct deal for 60 Quintals Onion at ₹1,490/q. Action required: Approve & Assign Drop Location.',
    time: '2 mins ago',
    unread: true,
    link: '/buyer/dashboard',
    icon: '🌾',
    badge: 'Action Needed',
    color: 'amber',
  },
  {
    id: 'B-NOTIF-2',
    category: 'lots',
    title: 'New Verified Harvest Lot Listed',
    message: 'Suresh Patil listed 200 Quintals Grade A Onion in Nashik at ₹1,460/q base price.',
    time: '18 mins ago',
    unread: true,
    link: '/buyer/find-farmers',
    icon: '🧅',
    badge: 'Fresh Lot',
    color: 'blue',
  },
  {
    id: 'B-NOTIF-3',
    category: 'escrow',
    title: 'Escrow Account Locked & Verified',
    message: '₹89,400 locked in escrow for Order LOT-2026-MH01. Quality inspection ready.',
    time: '50 mins ago',
    unread: true,
    link: '/buyer/dashboard',
    icon: '🛡️',
    badge: 'Escrow Active',
    color: 'emerald',
  },
  {
    id: 'B-NOTIF-4',
    category: 'escrow',
    title: 'Farm-Gate Pickup Dispatched',
    message: 'Transporter MH-12-TR-8821 dispatched to Rahul Jadhav farm gate in Ausa, Latur.',
    time: '2 hours ago',
    unread: false,
    link: '/buyer/dashboard',
    icon: '🚚',
    badge: 'In-Transit',
    color: 'purple',
  },
];

export const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { user, isBuyer } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const storageKey = isBuyer ? 'krishak_notifications_buyer_v3' : 'krishak_notifications_farmer_v3';
  const defaultList = isBuyer ? buyerInitialNotifications : farmerInitialNotifications;

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultList;
    } catch {
      return defaultList;
    }
  });

  // Reload when role changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setNotifications(stored ? JSON.parse(stored) : defaultList);
      setActiveFilter('all');
    } catch {
      setNotifications(defaultList);
    }
  }, [isBuyer, storageKey]);

  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveNotifications = (newList) => {
    setNotifications(newList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newList));
    } catch (e) {}
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleNotificationClick = (notif) => {
    const updated = notifications.map((n) => (n.id === notif.id ? { ...n, unread: false } : n));
    saveNotifications(updated);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    saveNotifications(updated);
    if (showToast) showToast('All notifications marked as read ✓', 'info');
  };

  const simulateNewAlert = () => {
    let pick;
    if (isBuyer) {
      const buyerSims = [
        {
          title: '⚡ New Farmer Direct Sell Request',
          message: 'Dattatray Shinde sent a sell offer for 80Q Tomato at ₹3,100/q with farm-gate pickup.',
          category: 'requests',
          icon: '🍅',
          link: '/buyer/dashboard',
          badge: 'New Request',
          color: 'amber',
        },
        {
          title: 'Fresh Grade A Harvest Lot in Latur',
          message: 'Vikas Kadam listed 150 Quintals Soybean (Moisture < 10%) at ₹4,700/q.',
          category: 'lots',
          icon: '🌱',
          link: '/buyer/find-farmers',
          badge: 'New Lot',
          color: 'blue',
        },
      ];
      pick = buyerSims[Math.floor(Math.random() * buyerSims.length)];
    } else {
      const farmerSims = [
        {
          title: 'New High Buyer Bid: ₹1,520/q',
          message: 'Metro Wholesale Sourcing submitted a direct procurement tender for 80Q Onion.',
          category: 'deals',
          icon: '🌾',
          link: '/farmer/offers',
          badge: 'New Bid',
          color: 'emerald',
        },
        {
          title: 'Pune APMC Arrival Surge Alert',
          message: 'Pune APMC recorded heavy arrivals (+1,200 Q). Rate holding strong at ₹19.40/kg.',
          category: 'mandi',
          icon: '📊',
          link: '/farmer/markets',
          badge: 'Mandi Feed',
          color: 'amber',
        },
      ];
      pick = farmerSims[Math.floor(Math.random() * farmerSims.length)];
    }

    const newAlert = {
      id: `NOTIF-${Date.now()}`,
      category: pick.category,
      title: pick.title,
      message: pick.message,
      time: 'Just now',
      unread: true,
      link: pick.link,
      icon: pick.icon,
      badge: pick.badge,
      color: pick.color,
    };

    const updated = [newAlert, ...notifications];
    saveNotifications(updated);
    if (showToast) showToast(`🔔 ${pick.title}`, 'success');
  };

  const buyerFilters = [
    { id: 'all', label: 'All' },
    { id: 'requests', label: 'Farmer Requests' },
    { id: 'lots', label: 'Harvest Lots' },
    { id: 'escrow', label: 'Escrow' },
  ];

  const farmerFilters = [
    { id: 'all', label: 'All' },
    { id: 'deals', label: 'Buyer Bids' },
    { id: 'mandi', label: 'Mandi Rates' },
    { id: 'escrow', label: 'Escrow' },
  ];

  const activeFiltersList = isBuyer ? buyerFilters : farmerFilters;

  const filteredNotifs =
    activeFilter === 'all' ? notifications : notifications.filter((n) => n.category === activeFilter);

  return (
    <div className="relative" ref={dropdownRef} id="krishak-notification-container">
      {/* TRIGGER BUTTON (Aesthetic Bell with Badge) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative h-10 w-10 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs ${
          isOpen
            ? 'bg-white border-emerald-500 text-emerald-700 shadow-md ring-2 ring-emerald-500/20'
            : 'bg-slate-100/90 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
        }`}
        aria-label="Notifications"
        title="Notifications & Live Alerts"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-md px-1 ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* FLOATING NOTIFICATION MODAL - 100% SOLID OPAQUE WHITE */}
      {isOpen && (
        <div
          className="absolute right-0 top-13 mt-1 w-80 sm:w-96 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border-2 border-slate-200 z-[100] overflow-hidden text-xs animate-fade-in-up"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* HEADER (SOLID SLATE OPAQUE) */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-base">
                {isBuyer ? '🏪' : '🌾'}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white leading-tight">
                  {isBuyer ? 'Buyer Procurement Alerts' : 'Farmer Harvest Alerts'}
                </h3>
                <p className="text-[10.5px] text-slate-300 font-medium">
                  {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''} • Live Feed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-extrabold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* FILTER PILLS (SOLID OPAQUE SLATE-100) */}
          <div className="flex items-center gap-1.5 p-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto text-[11px] font-bold">
            {activeFiltersList.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-extrabold cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300/80'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* NOTIFICATION CARDS LIST (SOLID OPAQUE WHITE) */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 bg-white" style={{ backgroundColor: '#ffffff' }}>
            {filteredNotifs.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-medium bg-white">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-slate-50 transition-all cursor-pointer flex items-start gap-3 text-left ${
                    n.unread ? 'bg-emerald-50/60' : 'bg-white'
                  }`}
                  style={{ backgroundColor: n.unread ? '#f0fdf4' : '#ffffff' }}
                >
                  <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-base flex-shrink-0 shadow-xs mt-0.5">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-black truncate ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </h4>
                      {n.unread && (
                        <span className="h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0 ring-2 ring-emerald-200"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug font-medium line-clamp-2">{n.message}</p>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-slate-400 font-semibold">{n.time}</span>
                      <span className="font-extrabold px-2 py-0.5 rounded-md text-emerald-800 bg-emerald-100 border border-emerald-200">
                        {n.badge} →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER ACTION BAR (SOLID OPAQUE) */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]" style={{ backgroundColor: '#f8fafc' }}>
            <button
              onClick={simulateNewAlert}
              className="px-3 py-1.5 text-white font-black text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>⚡</span>
              <span>Test New Alert</span>
            </button>
            <span className="text-[10px] text-slate-500 font-semibold">
              Live Mandi &amp; Bids Stream
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
