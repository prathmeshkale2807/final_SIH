import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { marketService } from '../../services/marketService';

// ─── DECORATIVE WARLI FOLK-ART PANEL ──────────────────────────────────────────
const WarliArtPanel = () => (
  <div className="hidden sm:flex items-center justify-end w-full max-w-[460px] h-[72px] select-none pointer-events-none rounded-2xl overflow-hidden shadow-md border border-white/25" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B0D9EF 30%, #D4B896 55%, #C4A472 100%)' }}>
    <svg className="w-full h-full" viewBox="0 0 460 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sun Symbol */}
      <circle cx="280" cy="18" r="9" stroke="#F59E0B" strokeWidth="2" fill="#FBBF24" fillOpacity="0.35" />
      <path d="M280 4v5M280 27v5M266 18h5M289 18h5M270 8l3 3M287 25l3 3M270 28l3-3M287 11l3-3" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />

      {/* Moon Symbol */}
      <path d="M335 10a10 10 0 1 0 10 16 8 8 0 1 1-10-16z" fill="#1E40AF" opacity="0.5" />

      {/* Palm / Tree Symbol */}
      <path d="M420 60v-30M420 30c-8-8-20-4-24-1M420 30c8-8 20-4 24-1M420 30c-9 3-16 9-19 16M420 30c9 3 16 9 19 16" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />

      {/* Bull / Cattle 1 */}
      <path d="M100 40h20v8M100 48v-8l-8-6 3-5M118 40l3 8M93 32c-3-4-5-9-2-11s7 2 10 6" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Bull / Cattle 2 (Goat) */}
      <path d="M360 42h14v6M360 48v-6l-5-5 2-4M372 42l3 6M356 33c-2-3-3-7-1-9s5 2 7 5" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Warli Figure 1 (Dancing person) */}
      <circle cx="30" cy="20" r="4" fill="#78350F" />
      <polygon points="30,25 23,37 37,37" fill="#78350F" />
      <polygon points="30,48 23,37 37,37" fill="#78350F" />
      <path d="M23 31l-8-4M37 31l8-4M26 48l-5 12M34 48l5 12" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />

      {/* Warli Figure 2 (Dancing person) */}
      <circle cx="62" cy="22" r="4" fill="#92400E" />
      <polygon points="62,27 55,39 69,39" fill="#92400E" />
      <polygon points="62,50 55,39 69,39" fill="#92400E" />
      <path d="M55 33l-8 5M69 33l8-5M58 50l-4 10M66 50l4 10" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" />

      {/* Warli Figure 3 (With tool/sickle) */}
      <circle cx="155" cy="20" r="4" fill="#78350F" />
      <polygon points="155,25 148,37 162,37" fill="#78350F" />
      <polygon points="155,48 148,37 162,37" fill="#78350F" />
      <path d="M148 31l-9-2 3-6M162 31l9 3M151 48l-4 12M159 48l4 12" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />

      {/* Warli Figure 4 (Carrying basket on head) */}
      <circle cx="200" cy="20" r="4" fill="#92400E" />
      <ellipse cx="200" cy="13" rx="5.5" ry="3" fill="#D97706" opacity="0.8" />
      <polygon points="200,25 193,37 207,37" fill="#92400E" />
      <polygon points="200,48 193,37 207,37" fill="#92400E" />
      <path d="M193 31l-4-7 10-3M207 31l4-7-10-3M196 48l-4 12M204 48l4 12" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" />

      {/* Warli Figure 5 (Woman with pot) */}
      <circle cx="240" cy="22" r="3.5" fill="#78350F" />
      <circle cx="240" cy="16" r="3" fill="#B45309" opacity="0.7" />
      <polygon points="240,27 234,37 246,37" fill="#78350F" />
      <path d="M237 47l-3 10M243 47l3 10" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

      {/* Cart with Wheel */}
      <circle cx="308" cy="48" r="6" stroke="#92400E" strokeWidth="1.6" fill="none" />
      <path d="M308 42v12M302 48h12" stroke="#92400E" strokeWidth="1.2" />
      <path d="M295 46h22l9-10" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

// ─── MULTI-CROP DICTIONARY FOR INSTANT SWITCHING ──────────────────────────────
const CROP_PRESETS = {
  onion: {
    name: 'Onion',
    marathi: 'कांदा',
    variety: 'Red Onion (Garwa Grade A)',
    lotId: 'LOT-2026-ON01',
    quantity: '100 Quintals',
    apmcPrice: '₹2,100/q',
    apmcRaw: 2100,
    apmcTrend: '+5.1%',
    aiRange: '₹1,850 – ₹1,950/q',
    buyerName: 'AgroFresh Ltd',
    buyerPrice: '₹1,850/q',
    buyerDistance: '45 km',
    recommendation: 'WAIT 1 DAY ⏳',
    recommendationText: 'Supply arrivals expected to drop 14% tomorrow in Nashik & Pune yards.',
    singlePayout: '₹1,36,000',
    splitPayout: '₹1,38,700',
    extraProfit: '+₹2,700',
    splitRatio: '60Q Buyer + 40Q APMC',
    logisticsNote: 'Zero logistics stress on 60% harvest',
  },
  tomato: {
    name: 'Tomato',
    marathi: 'टोमॅटो',
    variety: 'Hybrid (Abhinav Grade A)',
    lotId: 'LOT-2026-TM04',
    quantity: '80 Quintals',
    apmcPrice: '₹1,650/q',
    apmcRaw: 1650,
    apmcTrend: '+8.4%',
    aiRange: '₹1,700 – ₹1,820/q',
    buyerName: 'Keventer Agro Pvt Ltd',
    buyerPrice: '₹1,720/q',
    buyerDistance: '32 km',
    recommendation: 'SELL TODAY ⚡',
    recommendationText: 'High perishability window and strong weekend retail demand in Mumbai.',
    singlePayout: '₹1,24,000',
    splitPayout: '₹1,28,400',
    extraProfit: '+₹4,400',
    splitRatio: '50Q Processor + 30Q APMC',
    logisticsNote: 'Direct farm gate crate pickup for 50Q',
  },
  grapes: {
    name: 'Grapes',
    marathi: 'द्राक्षे',
    variety: 'Thompson Seedless (Export Grade)',
    lotId: 'LOT-2026-GR02',
    quantity: '120 Quintals',
    apmcPrice: '₹4,800/q',
    apmcRaw: 4800,
    apmcTrend: '+3.5%',
    aiRange: '₹4,750 – ₹5,100/q',
    buyerName: 'Mahindra Agri Solutions',
    buyerPrice: '₹5,200/q',
    buyerDistance: '58 km',
    recommendation: 'LOCK CONTRACT 🤝',
    recommendationText: 'Exporter offering ₹400/q premium over terminal yard modal rate.',
    singlePayout: '₹5,40,000',
    splitPayout: '₹5,76,000',
    extraProfit: '+₹36,000',
    splitRatio: '90Q Exporter + 30Q Local',
    logisticsNote: 'Reefer cold chain pickup at farm gate',
  },
  soybean: {
    name: 'Soybean',
    marathi: 'सोयाबीन',
    variety: 'JS-335 (Yellow Bold)',
    lotId: 'LOT-2026-SB09',
    quantity: '60 Quintals',
    apmcPrice: '₹4,350/q',
    apmcRaw: 4350,
    apmcTrend: '+1.8%',
    aiRange: '₹4,300 – ₹4,420/q',
    buyerName: 'Adani Wilmar Oil Mill',
    buyerPrice: '₹4,450/q',
    buyerDistance: '28 km',
    recommendation: 'SELL TO MILL 🏭',
    recommendationText: 'Direct crushing mill buying at +₹100/q with immediate weighment payout.',
    singlePayout: '₹2,48,000',
    splitPayout: '₹2,54,000',
    extraProfit: '+₹6,000',
    splitRatio: '60Q Direct Mill',
    logisticsNote: 'Zero mandi commission & loading deductions',
  },
  cotton: {
    name: 'Cotton',
    marathi: 'कापूस',
    variety: 'Bt Cotton (Long Staple)',
    lotId: 'LOT-2026-CT01',
    quantity: '50 Quintals',
    apmcPrice: '₹7,200/q',
    apmcRaw: 7200,
    apmcTrend: '+2.1%',
    aiRange: '₹7,150 – ₹7,380/q',
    buyerName: 'Vardhman Ginning Mill',
    buyerPrice: '₹7,400/q',
    buyerDistance: '35 km',
    recommendation: 'SELL TO GINNER 🧵',
    recommendationText: 'Ginning mill moisture tolerance is higher than standard yard benchmark.',
    singlePayout: '₹3,45,000',
    splitPayout: '₹3,55,000',
    extraProfit: '+₹10,000',
    splitRatio: '40Q Ginner + 10Q APMC',
    logisticsNote: 'Direct mill weighing dock allocation',
  }
};

export const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const { user } = useAuth();

  // Active crop selection (defaults to user's registered crop or onion)
  const initialCropKey = (user?.primaryCrop?.toLowerCase() in CROP_PRESETS) 
    ? user.primaryCrop.toLowerCase() 
    : 'onion';
  const [selectedCropKey, setSelectedCropKey] = useState(initialCropKey);
  const currentCrop = CROP_PRESETS[selectedCropKey] || CROP_PRESETS.onion;

  // Active Explanatory Modals State
  const [activeModal, setActiveModal] = useState(null); // 'why-ai' | 'why-split' | 'buyer-details' | 'lot-details'

  // Regional APMC benchmark rates
  const [mandiRates, setMandiRates] = useState([
    { name: 'Pune APMC Market Yard', rate: '₹2,100/q', rawRate: 2100, net: '₹2,045/q Net', distance: '45 km', trend: '+5.1%', tag: 'Best Net' },
    { name: 'Lasalgaon APMC (Nashik)', rate: '₹1,820/q', rawRate: 1820, net: '₹1,745/q Net', distance: '85 km', trend: '+3.2%', tag: 'Largest Hub' },
    { name: 'Mumbai APMC (Vashi)', rate: '₹2,100/q', rawRate: 2100, net: '₹1,890/q Net', distance: '165 km', trend: '+1.8%', tag: 'High Nominal' },
    { name: 'Latur APMC', rate: '₹1,760/q', rawRate: 1760, net: '₹1,695/q Net', distance: '62 km', trend: '+2.4%', tag: 'Local Yard' }
  ]);

  useEffect(() => {
    marketService.getPrices({ crop: selectedCropKey }).then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const top4 = data.slice(0, 4).map((m) => ({
          name: m.marketName || m.name,
          rate: `₹${(m.modalPricePerQuintal || currentCrop.apmcRaw).toLocaleString('en-IN')}/q`,
          rawRate: m.modalPricePerQuintal || currentCrop.apmcRaw,
          net: `₹${Math.round((m.modalPricePerQuintal || currentCrop.apmcRaw) - 55).toLocaleString('en-IN')}/q Net`,
          distance: `${m.distanceKm || 45} km`,
          trend: m.change || '+5.1%',
          tag: m.district || 'Verified APMC',
        }));
        if (top4.length > 0) setMandiRates(top4);
      }
    }).catch(() => {});
  }, [selectedCropKey, currentCrop.apmcRaw]);

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in max-w-7xl mx-auto font-sans">
      
      {/* ─── MAIN PHOTO BACKDROP CANVAS (EXACT LANDSCAPE WITH STEPPED FIELDS & RED ONIONS) ─── */}
      <div 
        className="relative rounded-[32px] overflow-hidden p-5 sm:p-9 shadow-2xl border border-slate-200/60 bg-cover bg-top space-y-7 min-h-[920px] flex flex-col justify-between"
        style={{
          backgroundImage: "url('/farmer_dashboard_hero.jpg')",
          backgroundColor: '#1b3b2b'
        }}
      >
        {/* Soft Ambient Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65 pointer-events-none"></div>

        {/* ─── 1. TOP HEADER BAR: BADGES (LEFT) & WARLI ART PANEL + LANG (RIGHT) ─── */}
        <div className="relative z-10 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left side: Verified Farmer Portal & Weather */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="inline-flex items-center space-x-2 bg-emerald-600 px-4 py-2.5 rounded-full text-sm font-extrabold text-white shadow-lg border border-emerald-400/50">
                <span className="text-white font-black text-base">✓</span>
                <span>{t('verified_farmer_portal', 'Verified Farmer Portal')}</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white border border-white/15 shadow-sm mt-1">
                <span>☀️</span>
                <span className="font-extrabold">29°C Sunny</span>
                <span>•</span>
                <span className="font-extrabold text-amber-200">{user?.village ? `${user.village}, ` : ''}{user?.district || user?.state || 'Ausa, Latur'}</span>
              </div>
            </div>

            {/* Right side: Decorative Warli Folk-Art Panel + Language Dropdown */}
            <div className="flex items-center gap-3">
              <WarliArtPanel />
              <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs text-white font-medium flex items-center gap-1.5">
                <span>🌐</span>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
                >
                  {availableLanguages.map(l => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white">{l.native}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Greeting Section & Main Action Buttons (Row 2) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-[52px] font-black tracking-tight text-white drop-shadow-lg leading-[1.1] font-display">
                {t('good_morning', 'Good Morning')},<br />
                {user?.name || user?.farmerName || 'Rahul Jadhav'}
              </h1>
              <div className="text-4xl -mt-1">👋</div>

              {/* Dynamic Crop & Land Details */}
              <div className="flex flex-col gap-0.5 text-sm sm:text-base text-white font-semibold drop-shadow-md pt-1">
                <span>{t('primary_crop_label', 'Primary Crop:')} <strong className="text-white font-black underline decoration-white decoration-2 underline-offset-4">{currentCrop.name}</strong> • {user?.landArea ? (String(user.landArea).includes('Acres') ? user.landArea : `${user.landArea} Acres`) : '8.5 Acres'}</span>
                <span>• {t('ready_for_selling', 'Ready For Selling')}</span>
              </div>

              {/* Quick Crop Selector Pills */}
              <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-emerald-200">Switch Crop:</span>
                {Object.keys(CROP_PRESETS).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSelectedCropKey(k)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedCropKey === k 
                        ? 'bg-[#F4B51B] text-slate-950 shadow-md font-black' 
                        : 'bg-black/35 hover:bg-black/50 text-white border border-white/20'
                    }`}
                  >
                    {CROP_PRESETS[k].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Action Buttons (Row 2) */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/farmer/best-deal')}
                className="flex-1 sm:flex-initial px-10 py-4.5 bg-[#F4B51B] hover:bg-amber-500 active:scale-95 text-[#162019] font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center space-x-2.5 cursor-pointer min-w-[200px]"
              >
                <span className="text-2xl">🧑‍🌾</span>
                <span>{t('find_deal', 'Find Deal')}</span>
              </button>
              <button
                onClick={() => navigate('/farmer/list-produce')}
                className="flex-1 sm:flex-initial px-8 py-4.5 bg-slate-800/80 hover:bg-slate-900/90 active:scale-95 text-white font-bold text-base sm:text-lg rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <span className="text-2xl leading-none font-normal">+</span>
                <span>{t('list_harvest', 'List Harvest')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── 2. FOUR MAIN DATA CARDS (ROW 3) ─── */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
          
          {/* Card 1: Today's APMC Rate Card */}
          <div 
            onClick={() => navigate('/farmer/markets')}
            className="bg-white rounded-[24px] p-5 shadow-2xl border border-slate-100 flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform relative overflow-hidden cursor-pointer group"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none"></div>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{t('today_market', "TODAY'S APMC RATE")}</span>
              <span className="text-[10px] text-[#167A55] font-mono font-black bg-[#DCFCE7] px-2 py-0.5 rounded">AGMARKNET LIVE</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl sm:text-4xl font-black text-[#162019] font-sans tracking-tight">
                {mandiRates[0]?.rate || currentCrop.apmcPrice}
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 bg-[#EDE9FE] text-[#5B21B6] text-xs font-black px-2 py-0.5 rounded">
                  <span>{currentCrop.apmcTrend}</span>
                  <span>📈</span>
                </span>
              </div>
            </div>
            <p className="relative z-10 text-xs text-slate-500 font-medium leading-tight pt-1">
              Pune APMC Modal <br />
              <span className="text-slate-400">(Lasalgaon: ₹1,820/q)</span>
            </p>
          </div>

          {/* Card 2: Tomorrow AI Range Card */}
          <div 
            onClick={() => setActiveModal('why-ai')}
            className="bg-white rounded-[24px] p-5 shadow-2xl border border-slate-100 flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{t('ai_forecast_tomorrow', 'TOMORROW AI RANGE')}</span>
              <span className="text-[10px] text-[#92400E] font-mono font-black bg-[#FEF3C7] px-2 py-0.5 rounded">AI PREDICT</span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#167A55] font-sans tracking-tight leading-tight">
                {currentCrop.aiRange}
              </div>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-tight flex items-center gap-1.5 pt-1">
              <span className="text-indigo-600 font-black text-sm">☑</span>
              <span>Upward Price Momentum (78% Conf)</span>
            </p>
          </div>

          {/* Card 3: Best Buyer Bid Card */}
          <div 
            onClick={() => setActiveModal('buyer-details')}
            className="bg-white rounded-[24px] p-5 shadow-2xl border border-slate-100 flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{t('best_opportunity', 'BEST BUYER BID')}</span>
              <span className="text-[10px] text-[#1E40AF] font-mono font-black bg-[#EFF6FF] px-2 py-0.5 rounded">BUYER</span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-[#162019] font-sans tracking-tight">
                {currentCrop.buyerPrice} <span className="text-xl font-bold text-slate-500 font-sans"></span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-tight pt-1">
              {currentCrop.buyerName} • {currentCrop.buyerDistance} <br />
              <span className="text-[#188A59] font-bold">🟢 Farm Gate Pickup Available</span>
            </p>
          </div>

          {/* Card 4: AI Recommendation Card */}
          <div 
            onClick={() => setActiveModal('why-ai')}
            className="bg-[#167A55] text-white rounded-[24px] p-5 shadow-2xl border border-emerald-600/30 flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#86EFAC] uppercase tracking-wider">{t('ai_recommendation', 'AI RECOMMENDATION')}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs">🤖</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Why?</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-[#F4B51B] tracking-wide font-display leading-tight flex items-center gap-2">
                <span>{currentCrop.recommendation}</span>
              </div>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed mt-2.5">
                {currentCrop.recommendationText}
              </p>
            </div>
          </div>
        </div>

        {/* ─── 3. LOWER SECTION: HORIZONTAL ACTIVE LOT STRIP ─── */}
        <div 
          onClick={() => setActiveModal('lot-details')}
          className="relative z-10 bg-white rounded-[24px] p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-3 my-2 cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 bg-[#ECFDF5] text-[#065F46] px-3.5 py-1 rounded-full text-xs font-black uppercase border border-[#A7F3D0] w-fit">
              <span>🌾 {t('active_harvest_lot', 'ACTIVE HARVEST LOT')}</span>
            </div>

            <div className="inline-flex items-center space-x-2 bg-[#D1FAE5] text-[#064E3B] px-4 py-1.5 rounded-full text-xs font-black border border-[#6EE7B7] w-fit">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>3 {t('bids_received', 'Verified Buyer Bids Received')}</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#162019] tracking-tight">
              {currentCrop.quantity} {currentCrop.variety}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Listed Lot ID: <span className="font-mono font-bold text-slate-800">{currentCrop.lotId}</span> • Stored at: Farm Shed, Ausa
            </p>
          </div>
        </div>

        {/* ─── 4. ROW OF THREE FINAL CARDS (FINANCIAL COMPARISON) ─── */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
          
          {/* Card 1: Single Market Payout Card */}
          <div className="bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {t('single_market_payout', 'SINGLE MARKET PAYOUT')}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#162019] font-sans tracking-tight">
              {currentCrop.singlePayout}
            </div>
            <p className="text-xs text-slate-500 font-medium pt-1">
              If 100% sold at Pune APMC Yard
            </p>
          </div>

          {/* Card 2: FasalSetu Split Payout Card */}
          <div 
            onClick={() => setActiveModal('why-split')}
            className="bg-[#F0FDF4] p-6 rounded-[24px] shadow-2xl border border-emerald-300 space-y-2 cursor-pointer hover:border-emerald-500 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#167A55] uppercase tracking-wider block">
                FASALSETU SPLIT PAYOUT
              </span>
              <span className="text-xs text-emerald-700 font-bold group-hover:underline">Why? ➔</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#167A55] font-sans tracking-tight">
              {currentCrop.splitPayout}
            </div>
            <p className="text-xs text-[#188A59] font-bold pt-1 flex items-center gap-1">
              <span>{currentCrop.extraProfit} extra take-home profit</span>
            </p>
          </div>

          {/* Card 3: Recommended Split Card */}
          <div 
            onClick={() => setActiveModal('why-split')}
            className="bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100 space-y-2 cursor-pointer hover:border-emerald-300 transition-all"
          >
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {t('recommended_split', 'RECOMMENDED SPLIT')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#162019] tracking-tight">
              {currentCrop.splitRatio}
            </div>
            <p className="text-xs text-slate-500 font-medium pt-1">
              {currentCrop.logisticsNote}
            </p>
          </div>
        </div>

      </div>

      {/* ─── 5. REGIONAL APMC MANDIS BENCHMARK TABLE ─── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#162019] text-base">{t('regional_apmc_rates', 'Regional APMC Mandi Benchmark Rates')}</h3>
            <p className="text-xs text-[#647168]">Live modal rate vs estimated net take-home realization</p>
          </div>
          <button
            onClick={() => navigate('/farmer/markets')}
            className="text-xs font-bold text-[#167A55] hover:text-emerald-900 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>{t('view_all_mandis', 'View All Mandis')}</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mandiRates.map((m, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/farmer/markets')}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs group-hover:text-emerald-900">{m.name}</span>
                <span className="text-[10px] font-bold text-[#167A55] bg-emerald-100 px-1.5 py-0.5 rounded">{m.trend}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-black text-slate-900 font-mono">{m.rate}</div>
                <div className="text-xs font-extrabold text-[#167A55] font-mono">{m.net}</div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 font-medium">
                <span>Distance: {m.distance}</span>
                <span className="text-slate-600 font-semibold">{m.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. TOUCH-FRIENDLY QUICK ACTION TILES ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/farmer/best-deal')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2 cursor-pointer"
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🏆
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-[#167A55]">Maximum Profit</div>
            <p className="text-xs text-slate-500 mt-0.5">Split channel optimizer for highest payout</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/farmer/markets')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2 cursor-pointer"
        >
          <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📊
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-[#167A55]">APMC Mandis</div>
            <p className="text-xs text-slate-500 mt-0.5">Live prices, arrivals &amp; 5-day trends</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/farmer/offers')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2 cursor-pointer"
        >
          <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🤝
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-[#167A55]">Buyer Bids</div>
            <p className="text-xs text-slate-500 mt-0.5">3 corporate buyers currently bidding</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/farmer/transactions')}
          className="group p-5 bg-white hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-3xl text-left shadow-xs hover:shadow-md transition-all active:scale-95 space-y-2 cursor-pointer"
        >
          <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🛡️
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 group-hover:text-[#167A55]">Escrow Payouts</div>
            <p className="text-xs text-slate-500 mt-0.5">Guaranteed bank settlement tracking</p>
          </div>
        </button>
      </div>

      {/* ─── 7. EXPLANATORY MODALS ────────────────────────────────────────────── */}
      
      {/* Modal 1: Why AI Recommendation */}
      {activeModal === 'why-ai' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <h3 className="text-lg font-extrabold text-[#162019]">AI Price Intelligence Explanation</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <div className="font-bold text-[#167A55] flex items-center gap-1.5">
                  <span>📉</span>
                  <span>Supply Inflow Contraction (-14%)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Historical Agmarknet data indicates 14% lower arrivals tomorrow across Lasalgaon, Pune, and Ahmednagar yards due to regional temple festivals.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>🌦️</span>
                  <span>Favorable Storage Weather</span>
                </div>
                <p className="text-xs text-slate-600">
                  Humidity is stable at 48% with 29°C in Ausa. Onion quality in your ventilated farm shed will remain Grade A without weight decay.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <span>📈</span>
                  <span>78% Upward Price Confidence</span>
                </div>
                <p className="text-xs text-slate-600">
                  Expected realization increases by +₹50 to +₹100/q if harvest is held for 24 hours.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-[#167A55] hover:bg-emerald-800 text-white font-bold rounded-2xl transition-all cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Why Split Recommendation */}
      {activeModal === 'why-split' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                <h3 className="text-lg font-extrabold text-[#162019]">Highest Price ≠ Highest Profit Principle</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <p className="text-xs text-slate-500 font-medium">
                FasalSetu uses Linear Programming optimization to eliminate middleman deductions and maximize the farmer's net take-home realization:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 uppercase">Single APMC Yard Sale</div>
                  <div className="text-2xl font-black text-slate-900">₹1,36,000</div>
                  <ul className="text-xs text-slate-500 space-y-1 pt-1">
                    <li>• Transport 165 km: -₹7,500</li>
                    <li>• Mandi Cess &amp; Weighing: -₹2,200</li>
                    <li>• Price volatility risk: High</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-1.5">
                  <div className="text-xs font-black text-[#167A55] uppercase">FasalSetu Split Plan</div>
                  <div className="text-2xl font-black text-[#167A55]">₹1,38,700</div>
                  <ul className="text-xs text-[#167A55] font-semibold space-y-1 pt-1">
                    <li>✓ 60Q Farm Gate Pickup (Zero Freight)</li>
                    <li>✓ 40Q captures terminal peak modal</li>
                    <li>✓ Net Extra Take-Home: <strong>+₹2,700</strong></li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 font-medium">
                💡 <strong>आपल्या हातात येणारी रक्कम:</strong> Verified corporate buyers pay direct bank escrow within 2 hours of weighment at your farm shed.
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveModal(null);
                  navigate('/farmer/best-deal');
                }}
                className="flex-1 py-3 bg-[#F4B51B] hover:bg-amber-500 text-slate-950 font-black rounded-2xl transition-all cursor-pointer"
              >
                Execute Split Plan →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Buyer Details */}
      {activeModal === 'buyer-details' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">🟢 Verified Buyer</span>
                <h3 className="text-xl font-black text-[#162019] mt-1">{currentCrop.buyerName}</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Offered Price:</span>
                <span className="font-black text-slate-900 text-base">{currentCrop.buyerPrice}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Pickup Logistics:</span>
                <span className="font-bold text-[#167A55]">Farm Gate Pickup (Zero Cost)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Nearest Collection Centre:</span>
                <span className="font-semibold text-slate-800">Nashik Hub (45 km)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Payment Reliability Score:</span>
                <span className="font-bold text-emerald-700">96 / 100 (Escrow Protected)</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveModal(null);
                  navigate('/farmer/offers');
                }}
                className="flex-1 py-3 bg-[#167A55] hover:bg-emerald-800 text-white font-bold rounded-2xl transition-all cursor-pointer"
              >
                View All 3 Buyer Bids
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Active Lot Details */}
      {activeModal === 'lot-details' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">🌾 Active Lot</span>
                <h3 className="text-xl font-black text-[#162019] mt-1">{currentCrop.lotId}</h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Crop &amp; Variety:</span>
                <span className="font-bold text-slate-900">{currentCrop.variety}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Available Quantity:</span>
                <span className="font-black text-slate-900 text-base">{currentCrop.quantity}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Storage Location:</span>
                <span className="font-semibold text-slate-800">Farm Shed, Ausa, Latur</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Verified Buyer Bids:</span>
                <span className="font-bold text-emerald-700">3 Offers Received</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveModal(null);
                  navigate('/farmer/best-deal');
                }}
                className="flex-1 py-3 bg-[#F4B51B] hover:bg-amber-500 text-slate-950 font-black rounded-2xl transition-all cursor-pointer"
              >
                Find Best Deal For Lot →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
