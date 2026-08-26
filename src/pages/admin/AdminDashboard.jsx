import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // overview, farmers, buyers, produce, escrow, mandi, settings
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingMandi, setSyncingMandi] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now (Live)');

  // Dynamic state for realistic admin actions
  const [farmersList, setFarmersList] = useState([
    {
      id: 'FARM-2026-MH01',
      name: 'Rahul Jadhav',
      mobile: '+91 98765 43210',
      location: 'Ausa, Latur, MH',
      landArea: '8.5 Acres',
      primaryCrop: 'Onion (Nashik Red)',
      kycStatus: 'Verified',
      trustScore: 98,
      lotsListed: 3,
      joined: '12 Jan 2026',
    },
    {
      id: 'FARM-2026-NS04',
      name: 'Ramesh Shinde',
      mobile: '+91 94230 11982',
      location: 'Dindori, Nashik, MH',
      landArea: '12.0 Acres',
      primaryCrop: 'Tomato (Hybrid)',
      kycStatus: 'Verified',
      trustScore: 94,
      lotsListed: 5,
      joined: '18 Jan 2026',
    },
    {
      id: 'FARM-2026-PN09',
      name: 'Sunita Patil',
      mobile: '+91 98901 23456',
      location: 'Baramati, Pune, MH',
      landArea: '6.2 Acres',
      primaryCrop: 'Soybean',
      kycStatus: 'Pending Review',
      trustScore: 82,
      lotsListed: 1,
      joined: '24 Feb 2026',
    },
    {
      id: 'FARM-2026-KL14',
      name: 'Anand Kulkarni',
      mobile: '+91 97654 32109',
      location: 'Karad, Satara, MH',
      landArea: '15.0 Acres',
      primaryCrop: 'Wheat (Sharbati)',
      kycStatus: 'Pending Review',
      trustScore: 88,
      lotsListed: 2,
      joined: '02 Mar 2026',
    },
    {
      id: 'FARM-2026-NG21',
      name: 'Devendra Bhoyar',
      mobile: '+91 99223 88123',
      location: 'Katol, Nagpur, MH',
      landArea: '9.0 Acres',
      primaryCrop: 'Nagpur Orange / Citrus',
      kycStatus: 'Verified',
      trustScore: 96,
      lotsListed: 4,
      joined: '15 Jan 2026',
    },
  ]);

  const [buyersList, setBuyersList] = useState([
    {
      id: 'BUY-2026-PN08',
      businessName: 'AgroFresh Food Processors Ltd.',
      ownerName: 'Vikram Mehta',
      mobile: '+91 98220 12345',
      location: 'Pune APMC Industrial Estate, MH',
      businessType: 'Food Processor & Exporter',
      gstin: '27AAACA1234F1Z8',
      trustScore: 96,
      status: 'Verified Enterprise',
      escrowDeposited: '₹14,50,000',
      monthlyVolume: '200 MT',
    },
    {
      id: 'BUY-2026-MB11',
      businessName: 'Metro Wholesale Agro Desk',
      ownerName: 'Sanjay Agarwal',
      mobile: '+91 98111 88442',
      location: 'Vashi APMC Yard, Navi Mumbai',
      businessType: 'Hypermarket Chain',
      gstin: '27BBBCB5678G2Z1',
      trustScore: 99,
      status: 'Verified Enterprise',
      escrowDeposited: '₹32,00,000',
      monthlyVolume: '450 MT',
    },
    {
      id: 'BUY-2026-NS02',
      businessName: 'Sahyadri Onion Traders & Cold Storage',
      ownerName: 'Ganesh Shirole',
      mobile: '+91 98500 44321',
      location: 'Pimpalgaon APMC, Nashik',
      businessType: 'Wholesaler / Stockist',
      gstin: '27CCCC19876H3Z4',
      trustScore: 91,
      status: 'Pending Review',
      escrowDeposited: '₹5,00,000',
      monthlyVolume: '120 MT',
    },
    {
      id: 'BUY-2026-LT05',
      businessName: 'Marathwada Oil Extraction Mills',
      ownerName: 'Kishor Dhoot',
      mobile: '+91 94222 33110',
      location: 'Latur MIDC, MH',
      businessType: 'Solvent Extraction Plant',
      gstin: '27DDDD23456I4Z7',
      trustScore: 95,
      status: 'Verified Enterprise',
      escrowDeposited: '₹22,00,000',
      monthlyVolume: '300 MT',
    },
  ]);

  const [produceLots, setProduceLots] = useState([
    {
      id: 'LOT-9921',
      crop: 'Nashik Red Onion',
      farmer: 'Rahul Jadhav (FARM-2026-MH01)',
      quantity: '60 Quintals (6 MT)',
      targetPrice: '₹19.00/kg',
      apmcModal: '₹18.40/kg',
      qualityGrade: 'Grade A (Export)',
      location: 'Ausa, Latur',
      status: 'Active',
      statusColor: 'emerald',
      featured: true,
    },
    {
      id: 'LOT-9922',
      crop: 'Hybrid Tomato',
      farmer: 'Ramesh Shinde (FARM-2026-NS04)',
      quantity: '40 Quintals (4 MT)',
      targetPrice: '₹33.50/kg',
      apmcModal: '₹32.10/kg',
      qualityGrade: 'Grade A',
      location: 'Dindori, Nashik',
      status: 'Active',
      statusColor: 'emerald',
      featured: false,
    },
    {
      id: 'LOT-9923',
      crop: 'Latur Yellow Soybean',
      farmer: 'Sunita Patil (FARM-2026-PN09)',
      quantity: '100 Quintals (10 MT)',
      targetPrice: '₹4,750/Q',
      apmcModal: '₹4,650/Q',
      qualityGrade: 'Processing Grade',
      location: 'Baramati, Pune',
      status: 'In Escrow',
      statusColor: 'blue',
      featured: false,
    },
    {
      id: 'LOT-9924',
      crop: 'Nagpur Mandarin Oranges',
      farmer: 'Devendra Bhoyar (FARM-2026-NG21)',
      quantity: '80 Quintals (8 MT)',
      targetPrice: '₹45.00/kg',
      apmcModal: '₹42.00/kg',
      qualityGrade: 'Grade A+ Table Fruit',
      location: 'Katol, Nagpur',
      status: 'Flagged (Price)',
      statusColor: 'amber',
      featured: false,
    },
  ]);

  const [escrowList, setEscrowList] = useState([
    {
      txnId: 'ESC-2026-8831',
      lot: '60Q Onion (Grade A)',
      seller: 'Rahul Jadhav (Ausa)',
      buyer: 'AgroFresh Food Processors Ltd.',
      amount: '₹1,14,000',
      step: 6,
      stepLabel: 'Inspection Approved ➔ Disbursal Pending',
      status: 'Pending Disbursal',
      date: '26 Aug 2026, 11:45 AM',
    },
    {
      txnId: 'ESC-2026-8832',
      lot: '40Q Tomato (Hybrid)',
      seller: 'Ramesh Shinde (Nashik)',
      buyer: 'Metro Wholesale Agro Desk',
      amount: '₹1,34,000',
      step: 7,
      stepLabel: '100% Settled & Bank Credited',
      status: 'Settled',
      date: '25 Aug 2026, 04:30 PM',
    },
    {
      txnId: 'ESC-2026-8833',
      lot: '100Q Soybean (Cleaned)',
      seller: 'Sunita Patil (Baramati)',
      buyer: 'Marathwada Oil Extraction Mills',
      amount: '₹4,65,000',
      step: 3,
      stepLabel: 'In Transit • GPS Monitored',
      status: 'In Transit',
      date: '26 Aug 2026, 09:15 AM',
    },
    {
      txnId: 'ESC-2026-8834',
      lot: '80Q Nagpur Oranges',
      seller: 'Devendra Bhoyar (Katol)',
      buyer: 'AgroFresh Food Processors Ltd.',
      amount: '₹3,36,000',
      step: 2,
      stepLabel: 'Buyer Funds Locked in Escrow Account',
      status: 'Escrow Funded',
      date: '26 Aug 2026, 12:05 PM',
    },
  ]);

  const [mandiRates, setMandiRates] = useState([
    { mandi: 'Nashik APMC', commodity: 'Onion (Red)', min: 14.50, modal: 18.40, max: 22.00, arrivals: '2,800 Q', change: '+5.2%', status: 'Active' },
    { mandi: 'Pune APMC', commodity: 'Tomato (Hybrid)', min: 28.00, modal: 32.10, max: 36.50, arrivals: '1,450 Q', change: '-2.4%', status: 'Active' },
    { mandi: 'Mumbai APMC (Vashi)', commodity: 'Potato (Jyoti)', min: 20.00, modal: 24.50, max: 28.00, arrivals: '3,200 Q', change: '+1.8%', status: 'Active' },
    { mandi: 'Latur APMC', commodity: 'Soybean (Yellow)', min: 4300, modal: 4650, max: 4850, arrivals: '4,100 Q', change: '+3.1%', status: 'Active' },
    { mandi: 'Lasalgaon APMC', commodity: 'Onion (Export)', min: 16.00, modal: 19.80, max: 23.50, arrivals: '5,600 Q', change: '+6.4%', status: 'Active' },
    { mandi: 'Nagpur APMC', commodity: 'Orange / Santra', min: 35.00, modal: 42.00, max: 50.00, arrivals: '1,800 Q', change: '+2.0%', status: 'Active' },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { timestamp: '12:32:10', admin: 'ADMIN-KRISHAK-01', action: 'APMC Feeds Synchronization Triggered', ip: '192.168.1.104', type: 'info' },
    { timestamp: '11:48:22', admin: 'ADMIN-KRISHAK-01', action: 'Approved KYC for Farmer: Rahul Jadhav (FARM-2026-MH01)', ip: '192.168.1.104', type: 'success' },
    { timestamp: '10:15:05', admin: 'ADMIN-KRISHAK-01', action: 'Escrow Payout Disbursal Approved: ₹1,34,000 for TXN-8832', ip: '192.168.1.104', type: 'success' },
    { timestamp: '09:30:44', admin: 'SYSTEM_BOT', action: 'Daily APMC Mandi Ingestion completed (36 yards parsed)', ip: 'localhost', type: 'info' },
  ]);

  // Handle manual APMC sync
  const handleTriggerSync = () => {
    setSyncingMandi(true);
    setTimeout(() => {
      setSyncingMandi(false);
      setLastSyncTime(new Date().toLocaleTimeString());
      setAuditLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          admin: user?.name || 'ADMIN-KRISHAK-01',
          action: 'Manual APMC Mandi price scrape & AI prediction models refreshed',
          ip: '127.0.0.1',
          type: 'success',
        },
        ...prev,
      ]);
      if (showToast) showToast('Live APMC Mandi sync completed. All rates updated.');
    }, 1200);
  };

  // Toggle KYC status
  const handleToggleKYC = (farmerId) => {
    setFarmersList((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          const nextStatus = f.kycStatus === 'Verified' ? 'Pending Review' : 'Verified';
          if (showToast) showToast(`KYC status for ${f.name} changed to ${nextStatus}`);
          return { ...f, kycStatus: nextStatus };
        }
        return f;
      })
    );
  };

  // Release Escrow Payout
  const handleReleasePayout = (txnId) => {
    setEscrowList((prev) =>
      prev.map((e) => {
        if (e.txnId === txnId) {
          if (showToast) showToast(`Escrow Payout of ${e.amount} released to seller bank account`);
          return { ...e, status: 'Settled', step: 7, stepLabel: '100% Settled & Bank Credited' };
        }
        return e;
      })
    );
  };

  // Toggle Produce Feature
  const handleToggleFeature = (lotId) => {
    setProduceLots((prev) =>
      prev.map((p) => {
        if (p.id === lotId) {
          const isFeatured = !p.featured;
          if (showToast) showToast(isFeatured ? `${p.crop} featured on platform homepage!` : `${p.crop} removed from featured`);
          return { ...p, featured: isFeatured };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 pb-24 font-sans text-slate-900">
      
      {/* ========================================================================= */}
      {/* 1. TOP EXECUTIVE CONTROL TOWER HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* GLOW DECORATIONS */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-md flex items-center space-x-1.5 shadow-sm">
              <span className="live-dot"></span>
              <span>KRISHAK SUPERADMIN CONTROL TOWER</span>
            </span>
            <span className="bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[10px] font-mono px-2 py-0.5 rounded">
              Clearance: Tier-1 Master Operations
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight">
            Marketplace Command & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Real-time platform oversight, APMC feed synchronization, farmer/buyer KYC approval, and multi-lakh escrow clearing operations.
          </p>
        </div>

        {/* TOP QUICK ACTIONS */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full lg:w-auto">
          <button
            onClick={handleTriggerSync}
            disabled={syncingMandi}
            className="btn-shimmer flex-1 lg:flex-none px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <i className={`ri-refresh-line text-sm ${syncingMandi ? 'animate-spin' : ''}`}></i>
            <span>{syncingMandi ? 'Syncing Mandis...' : 'Sync APMC Rates Now'}</span>
          </button>

          <div className="px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-left text-xs font-mono">
            <div className="text-[10px] text-slate-400">LAST MANDI SYNC</div>
            <div className="text-emerald-400 font-bold">{lastSyncTime}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME KPI METRIC GAUGES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Platform GMV</span>
            <span>💰</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">₹4.82 Cr</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center">
            <span>↑ +18.4%</span>
            <span className="text-slate-400 ml-1 font-normal">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Escrow Pool</span>
            <span>🛡️</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-800">₹84.6 L</div>
          <div className="text-[10px] text-emerald-700 font-bold">100% Dispute-Free</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Farmers</span>
            <span>🌾</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">{farmersList.length + 4815}</div>
          <div className="text-[10px] text-emerald-600 font-bold">+142 this week</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Enterprise Buyers</span>
            <span>🏪</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-blue-900">{buyersList.length + 376}</div>
          <div className="text-[10px] text-blue-600 font-bold">96% Verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Active Produce</span>
            <span>📦</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">1,240 MT</div>
          <div className="text-[10px] text-emerald-600 font-bold">88% Match Rate</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>APMC Mandis</span>
            <span>📊</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-harvest-800">36 Yards</div>
          <div className="text-[10px] text-emerald-600 font-bold">Live Stream Active</div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. ADMIN PORTAL NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold scrollbar-none">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>📊</span>
          <span>Overview & Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'farmers'
              ? 'bg-emerald-700 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>🌾</span>
          <span>Farmer KYC & Accounts ({farmersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'buyers'
              ? 'bg-blue-700 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>🏪</span>
          <span>Enterprise Buyers ({buyersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('produce')}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'produce'
              ? 'bg-amber-600 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>📦</span>
          <span>Produce Listings ({produceLots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'escrow'
              ? 'bg-emerald-900 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>🛡️</span>
          <span>Escrow Clearing ({escrowList.filter((e) => e.status !== 'Settled').length} Active)</span>
        </button>

        <button
          onClick={() => setActiveTab('mandi')}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'mandi'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>📈</span>
          <span>Mandi Price Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-slate-900 text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span>⚙️</span>
          <span>Audit & Security Logs</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & CONTROL TOWER */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ESCROW CLEARING PIPELINE SUMMARY */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Live Escrow Settlement Queue
                  </h2>
                  <p className="text-xs text-slate-500">Transactions undergoing quality audit and bank settlement.</p>
                </div>
                <button
                  onClick={() => setActiveTab('escrow')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All ({escrowList.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {escrowList.slice(0, 3).map((item) => (
                  <div
                    key={item.txnId}
                    className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{item.txnId}</span>
                        <span className="text-xs font-extrabold text-slate-800">• {item.lot}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Seller: <strong className="text-slate-700">{item.seller}</strong> ➔ Buyer: <strong className="text-slate-700">{item.buyer}</strong>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-bold">
                        Status: {item.stepLabel}
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <div className="text-sm font-black font-mono text-emerald-800">{item.amount}</div>
                      {item.status === 'Pending Disbursal' ? (
                        <button
                          onClick={() => handleReleasePayout(item.txnId)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[10px] font-black rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Release Payout
                        </button>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Settled' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE APMC ARBITRAGE RADAR */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    APMC Price Arbitrage Monitor
                  </h2>
                  <p className="text-xs text-slate-500">Top inter-market price spreads detected today.</p>
                </div>
                <span className="live-dot"></span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-emerald-950">🧅 Onion (Nashik ➔ Mumbai)</span>
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded text-[10px]">
                      +₹3.60/kg Spread
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Nashik Modal: ₹18.40 • Vashi APMC Modal: ₹22.00 • Freight Cost: ₹1.20/kg.
                  </p>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-blue-950">🍅 Tomato (Dindori ➔ Pune)</span>
                    <span className="font-mono font-bold text-blue-800 bg-blue-200/80 px-2 py-0.5 rounded text-[10px]">
                      +₹4.10/kg Spread
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    Nashik Modal: ₹28.00 • Pune Modal: ₹32.10 • Freight Cost: ₹1.40/kg.
                  </p>
                </div>

                <div className="p-3.5 bg-harvest-50/80 border border-harvest-200/80 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-harvest-950">🌾 Soybean (Latur ➔ Solapur)</span>
                    <span className="font-mono font-bold text-harvest-900 bg-harvest-200 px-2 py-0.5 rounded text-[10px]">
                      +₹180/Q Spread
                    </span>
                  </div>
                  <p className="text-[11px] text-harvest-900">
                    Latur Modal: ₹4,650/Q • Solapur Modal: ₹4,830/Q • Freight: ₹60/Q.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('mandi')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Inspect All Mandis & Overrides →
              </button>
            </div>

          </div>

          {/* RECENT PLATFORM AUDIT LOGS */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Real-Time Security & Action Trail
            </h2>
            <div className="space-y-2 font-mono text-xs">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between gap-2 border border-slate-200/50">
                  <div className="flex items-center space-x-3 truncate">
                    <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
                    <span className="text-emerald-700 font-bold truncate">{log.admin}</span>
                    <span className="text-slate-700 truncate">{log.action}</span>
                  </div>
                  <span className="text-slate-400 text-[10px] flex-shrink-0">{log.ip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FARMER DIRECTORY & KYC APPROVAL */}
      {/* ========================================================================= */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Registered Farmers & KYC Verifications
              </h2>
              <p className="text-xs text-slate-500">
                Verify land ownership documents (7/12 extract, Aadhaar) and manage farmer seller privileges.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search farmer name, ID, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Farmer Details</th>
                  <th className="py-3 px-3">Location & Land</th>
                  <th className="py-3 px-3">Primary Crop</th>
                  <th className="py-3 px-3">Trust Score</th>
                  <th className="py-3 px-3">KYC Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {farmersList
                  .filter((f) =>
                    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    f.location.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-extrabold text-slate-900">{f.name}</div>
                        <div className="text-[11px] font-mono text-emerald-700">{f.id} • {f.mobile}</div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <div>{f.location}</div>
                        <div className="text-[10px] text-slate-400">{f.landArea}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800">{f.primaryCrop}</span>
                        <div className="text-[10px] text-slate-400">{f.lotsListed} active lots</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ⭐ {f.trustScore}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          f.kycStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {f.kycStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleToggleKYC(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                            f.kycStatus === 'Verified'
                              ? 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 hover:border-rose-200 border'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                        >
                          {f.kycStatus === 'Verified' ? 'Revoke KYC' : 'Approve KYC ✓'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ENTERPRISE BUYERS & SOURCING DESKS */}
      {/* ========================================================================= */}
      {activeTab === 'buyers' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Enterprise Buyers & Corporate Desks
              </h2>
              <p className="text-xs text-slate-500">
                Manage food processing units, institutional buyers, GSTIN registrations, and escrow limits.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Enterprise / Business</th>
                  <th className="py-3 px-3">Type & GSTIN</th>
                  <th className="py-3 px-3">Monthly Demand</th>
                  <th className="py-3 px-3">Escrow Balance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {buyersList.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-slate-900">{b.businessName}</div>
                      <div className="text-[11px] text-slate-500">{b.ownerName} • {b.mobile}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-700">{b.businessType}</div>
                      <div className="font-mono text-[10px] text-slate-400">{b.gstin}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                      {b.monthlyVolume}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {b.escrowDeposited}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          if (showToast) showToast(`Credit line of ₹50 Lakh verified for ${b.businessName}`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Set Limit
                      </button>
                      <button
                        onClick={() => {
                          if (showToast) showToast(`GSTIN ${b.gstin} Verified via GSTN Portal API ✓`);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Verify GSTIN
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PRODUCE LISTINGS & PRICE MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'produce' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Produce Listings & Market Rate Alignment
              </h2>
              <p className="text-xs text-slate-500">
                Monitor target prices against live APMC benchmark rates to prevent predatory pricing or listing spam.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Produce & Farmer</th>
                  <th className="py-3 px-3">Quantity & Grade</th>
                  <th className="py-3 px-3">Farmer Ask vs APMC Modal</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {produceLots.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-slate-900 flex items-center space-x-1.5">
                        <span>{p.crop}</span>
                        {p.featured && (
                          <span className="text-[9px] bg-harvest-400 text-slate-950 font-black px-1.5 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.id} • {p.farmer}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{p.quantity}</div>
                      <div className="text-[10px] text-slate-400">{p.qualityGrade}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-black text-slate-900">{p.targetPrice}</div>
                      <div className="text-[10px] text-emerald-700 font-mono">APMC Benchmark: {p.apmcModal}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-bold">
                      {p.location}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleFeature(p.id)}
                        className="px-2.5 py-1 bg-harvest-100 hover:bg-harvest-200 text-harvest-900 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        {p.featured ? 'Unfeature' : '⭐ Feature'}
                      </button>
                      <button
                        onClick={() => {
                          if (showToast) showToast(`Quality Grade verified for ${p.crop} lot.`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Verify Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ESCROW & SETTLEMENT ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'escrow' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                7-Step Escrow Clearing & Disbursal Master Engine
              </h2>
              <p className="text-xs text-slate-500">
                Automated multi-party escrow contracts protecting farmers from non-payment and buyers from grade fraud.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Contract / Lot</th>
                  <th className="py-3 px-3">Participants</th>
                  <th className="py-3 px-3">Escrow Value</th>
                  <th className="py-3 px-3">Workflow State</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3 text-right">Escrow Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {escrowList.map((e) => (
                  <tr key={e.txnId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-extrabold text-slate-900">{e.txnId}</div>
                      <div className="text-[11px] text-slate-600 font-bold">{e.lot}</div>
                    </td>
                    <td className="py-3.5 px-3 text-xs">
                      <div>🌾 {e.seller}</div>
                      <div className="text-slate-500">🏪 {e.buyer}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-black text-emerald-800 text-sm">
                        {e.amount}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        e.status === 'Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : e.status === 'Pending Disbursal'
                          ? 'bg-harvest-100 text-harvest-900 border border-harvest-300'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        {e.stepLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[10px]">
                      {e.date}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {e.status === 'Pending Disbursal' ? (
                        <button
                          onClick={() => handleReleasePayout(e.txnId)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Disburse to Bank ➔
                        </button>
                      ) : e.status === 'Settled' ? (
                        <span className="text-emerald-700 font-bold text-xs">✓ Funds Transferred</span>
                      ) : (
                        <button
                          onClick={() => {
                            if (showToast) showToast(`Weighbridge QC certificate approved for ${e.txnId}`);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Approve QC
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: MANDI PRICE ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'mandi' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                APMC Mandi Live Feed & Rate Override Table
              </h2>
              <p className="text-xs text-slate-500">
                Direct integration with state APMC aggregators. Adjust modal rates in case of emergency circuit breakers.
              </p>
            </div>

            <button
              onClick={handleTriggerSync}
              disabled={syncingMandi}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <i className={`ri-refresh-line ${syncingMandi ? 'animate-spin' : ''}`}></i>
              <span>Refresh All Mandis</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">APMC Yard</th>
                  <th className="py-3 px-3">Commodity</th>
                  <th className="py-3 px-3">Min Rate</th>
                  <th className="py-3 px-3">Modal (Benchmark)</th>
                  <th className="py-3 px-3">Max Rate</th>
                  <th className="py-3 px-3">Arrival Volume</th>
                  <th className="py-3 px-3">Trend</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {mandiRates.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-slate-900">{m.mandi}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-700">{m.commodity}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">₹{m.min}</td>
                    <td className="py-3.5 px-3 font-mono font-black text-emerald-800 text-sm">₹{m.modal}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">₹{m.max}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-700">{m.arrivals}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.change.startsWith('+') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {m.change}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => {
                          const newRate = prompt(`Enter new manual modal price override for ${m.commodity} at ${m.mandi}:`, m.modal);
                          if (newRate && !isNaN(newRate)) {
                            setMandiRates((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, modal: parseFloat(newRate) } : item))
                            );
                            if (showToast) showToast(`Rate for ${m.commodity} at ${m.mandi} updated to ₹${newRate}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Override Rate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: AUDIT & PLATFORM SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Platform Safety & Automation Toggles
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div>
                  <div className="font-bold text-slate-900">Auto-Disburse Escrows &lt; ₹50,000</div>
                  <div className="text-[11px] text-slate-500">Automatically disburse funds upon weighbridge slip upload.</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-emerald-600 rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div>
                  <div className="font-bold text-slate-900">Mandi Price Circuit Breaker (±15%)</div>
                  <div className="text-[11px] text-slate-500">Halt deals if asked price deviates abnormally from APMC average.</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-emerald-600 rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div>
                  <div className="font-bold text-slate-900">SMS OTP Fallback Gateway</div>
                  <div className="text-[11px] text-slate-500">Switch to secondary SMS provider if Firebase rate limit hit.</div>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-emerald-600 rounded cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Administrator Access Session
            </h2>

            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Current User:</span>
                <span className="text-emerald-400 font-bold">{user?.name || 'Chief Agricultural Officer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Admin Identifier:</span>
                <span className="text-white">{user?.adminId || user?.id || 'ADMIN-KRISHAK-01'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role & Privilege:</span>
                <span className="text-emerald-400 font-bold">SuperAdmin (Master Access)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Session IP:</span>
                <span className="text-white">127.0.0.1 (Local Verified)</span>
              </div>
            </div>

            <button
              onClick={async () => {
                await logout();
                if (showToast) showToast('Administrator signed out');
                navigate('/');
              }}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-black text-xs rounded-2xl transition-all cursor-pointer"
            >
              Sign Out of Administrator Session
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
