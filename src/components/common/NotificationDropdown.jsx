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
  },
  {
    id: 'F-NOTIF-3',
    category: 'escrow',
    title: 'Deal Approved & Drop Facility Set',
    message: 'AgroFresh approved your 60Q request. Assigned Drop Warehouse: Bhosari MIDC, Pune.',
    time: '45 mins ago',
    unread: true,
    link: '/farmer/transactions',
    icon: '🏢',
    badge: 'Drop Assigned',
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
  },
  {
    id: 'F-NOTIF-5',
    category: 'escrow',
    title: 'Escrow Payout Released to Bank',
    message: '₹52,000 released directly to your HDFC Bank account (•••• 4019).',
    time: '3 hours ago',
    unread: false,
    link: '/farmer/transactions',
    icon: '💰',
    badge: 'Bank Payout',
  },
];

// INITIAL NOTIFICATIONS FOR BUYER / ENTERPRISE TRADER
const buyerInitialNotifications = [
  {
    id: 'B-NOTIF-1',
    category: 'requests',
    title: '⚡ Incoming Farmer Sell Request',
    message: 'Rahul Jadhav requested direct deal for 60 Quintals Onion at ₹1,490/q. Action Required: Approve & Assign Drop Location.',
    time: '2 mins ago',
    unread: true,
    link: '/buyer/dashboard',
    icon: '🌾',
    badge: 'Action Needed',
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
  },
  {
    id: 'B-NOTIF-3',
    category: 'escrow',
    title: 'Escrow Account Locked & Verified',
    message: '₹89,400 locked in escrow for Order LOT-2026-MH01. Delivery inspection scheduled.',
    time: '50 mins ago',
    unread: true,
    link: '/buyer/dashboard',
    icon: '🛡️',
    badge: 'Escrow Active',
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
  },
  {
    id: 'B-NOTIF-5',
    category: 'requests',
    title: 'Tender Bids Received (3 Farmers)',
    message: '3 smallholders submitted matching supply quotes for your Pune 2000 KG Onion tender.',
    time: '4 hours ago',
    unread: false,
    link: '/buyer/dashboard',
    icon: '📋',
    badge: 'Tender Match',
  },
];

export const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { user, isBuyer } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const storageKey = isBuyer ? 'krishak_notifications_buyer_v2' : 'krishak_notifications_farmer_v2';
  const defaultList = isBuyer ? buyerInitialNotifications : farmerInitialNotifications;

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultList;
    } catch {
      return defaultList;
    }
  });

  // Reload correct list when role changes
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

  // Close dropdown on outside click
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
    showToast('All notifications marked as read ✓', 'info');
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
        },
        {
          title: 'Fresh Grade A Harvest Lot in Latur',
          message: 'Vikas Kadam listed 150 Quintals Soybean (Moisture < 10%) at ₹4,700/q.',
          category: 'lots',
          icon: '🌱',
          link: '/buyer/find-farmers',
          badge: 'New Lot',
        },
        {
          title: 'Delivery Arrived at Dock Warehouse',
          message: 'Lot LOT-2026-MH01 arrived at Bhosari MIDC. Ready for quality scan & escrow release.',
          category: 'escrow',
          icon: '🏢',
          link: '/buyer/dashboard',
          badge: 'Dock Arrived',
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
        },
        {
          title: 'Pune APMC Arrival Surge Alert',
          message: 'Pune APMC recorded heavy arrivals (+1,200 Q). Rate holding strong at ₹19.40/kg.',
          category: 'mandi',
          icon: '📊',
          link: '/farmer/markets',
          badge: 'Mandi Feed',
        },
        {
          title: 'Escrow Payment Released to Bank',
          message: '₹52,000 released to your Bank Account (HDFC Bank •••• 4019).',
          category: 'escrow',
          icon: '💰',
          link: '/farmer/transactions',
          badge: 'Bank Payout',
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
    };

    const updated = [newAlert, ...notifications];
    saveNotifications(updated);
    showToast(`🔔 ${pick.title}`, 'success');
  };

  // Filter Categories by Role
  const buyerFilters = [
    { id: 'all', label: 'All' },
    { id: 'requests', label: 'Farmer Requests' },
    { id: 'lots', label: 'Harvest Lots' },
    { id: 'escrow', label: 'Escrow & Delivery' },
  ];

  const farmerFilters = [
    { id: 'all', label: 'All' },
    { id: 'deals', label: 'Buyer Offers' },
    { id: 'mandi', label: 'Mandi Rates' },
    { id: 'escrow', label: 'Escrow Payouts' },
  ];

  const activeFiltersList = isBuyer ? buyerFilters : farmerFilters;

  const filteredNotifs =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.category === activeFilter);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 hover:text-slate-900 text-lg transition-all active:scale-95 shadow-xs flex items-center justify-center"
        aria-label="Notifications"
        title="Notifications & Alerts"
      >
        <i className="ri-notification-3-line"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white shadow-xs animate-badge-pop">
            {unreadCount}
          </span>
        )}
      </button>

      {/* FLOATING NOTIFICATION POPUP - 100% SOLID & NON-TRANSPARENT */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-slate-900/40 border-2 border-slate-200 z-[100] overflow-hidden animate-slide-down">
          
          {/* HEADER (SOLID DARK OPAQUE) */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{isBuyer ? '🏪' : '🌾'}</span>
              <div>
                <h3 className="font-extrabold text-sm leading-tight text-white">
                  {isBuyer ? 'Buyer Procurement Alerts' : 'Farmer Harvest Alerts'}
                </h3>
                <p className="text-[10px] text-slate-300 font-medium">
                  {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''} • {isBuyer ? 'Enterprise Desk' : 'Farm Gate'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-emerald-300 hover:text-emerald-200 hover:underline transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs font-bold transition-all"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ROLE-SPECIFIC FILTER PILLS (SOLID LIGHT OPAQUE) */}
          <div className="flex items-center space-x-1.5 p-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto text-[11px] font-bold">
            {activeFiltersList.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-extrabold ${
                  activeFilter === f.id
                    ? isBuyer
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* NOTIFICATION LIST (SOLID OPAQUE WHITE) */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-200 bg-white">
            {filteredNotifs.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 font-medium bg-white">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 sm:p-4 hover:bg-slate-100 transition-all cursor-pointer flex items-start space-x-3 text-left ${
                    n.unread ? (isBuyer ? 'bg-blue-50' : 'bg-emerald-50') : 'bg-white'
                  }`}
                >
                  <div className="h-10 w-10 rounded-2xl bg-white border border-slate-300 flex items-center justify-center text-lg flex-shrink-0 shadow-xs mt-0.5">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-black truncate ${n.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {n.title}
                      </h4>
                      {n.unread && (
                        <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ring-2 ${
                          isBuyer ? 'bg-blue-600 ring-blue-200' : 'bg-emerald-600 ring-emerald-200'
                        }`}></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug font-medium line-clamp-2">{n.message}</p>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-slate-500 font-semibold">{n.time}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-md border ${
                        isBuyer
                          ? 'text-blue-800 bg-blue-100 border-blue-200'
                          : 'text-emerald-800 bg-emerald-100 border-emerald-200'
                      }`}>
                        {n.badge} →
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER ACTION (SOLID OPAQUE) */}
          <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px]">
            <button
              onClick={simulateNewAlert}
              className={`px-3.5 py-1.5 text-white font-black rounded-xl shadow-xs transition-all flex items-center space-x-1.5 active:scale-95 ${
                isBuyer ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>⚡</span>
              <span>Simulate {isBuyer ? 'Buyer' : 'Farmer'} Alert</span>
            </button>
            <span className="text-[10px] text-slate-500 font-semibold">
              {isBuyer ? 'Enterprise Feed' : 'APMC & Deal Stream'}
            </span>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
