import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { dealService } from '../../services/dealService';

export const BuyerOffersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'myDeals'
  const [deals, setDeals] = useState(() => dealService.getFarmerDeals(user?.id));
  const [selectedOfferForRequest, setSelectedOfferForRequest] = useState(null);
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const computedAddress =
    user?.location ||
    [user?.village, user?.taluka, user?.district, user?.state].filter(Boolean).join(', ') ||
    'Ausa, Latur District, Maharashtra';

  const [farmerPickupAddress, setFarmerPickupAddress] = useState(
    computedAddress ? `${computedAddress} (Farm Gate / Shed)` : 'Gat No. 42, Farm Shed, Ausa, Latur, Maharashtra'
  );
  const [farmerMobile, setFarmerMobile] = useState(user?.mobile || '+91 9876543210');
  const [requestQty, setRequestQty] = useState(60);

  // REGISTERED VERIFIED BUYERS DIRECTORY
  const registeredBuyersList = [
    {
      id: 'OFF-901',
      buyerId: 'BUY-2026-PN08',
      buyer: 'AgroFresh Processors Ltd.',
      buyerMobile: '+91 9822012345',
      crop: 'Onion (Garwa Red / Nashik Red)',
      cropKey: 'onion',
      maxQty: 300,
      defaultQty: 60,
      unit: 'Quintals',
      price: 1880,
      priceStr: '₹1,880/q',
      trust: '96/100',
      badge: 'Verified Industrial Buyer',
      district: 'Pune / Nashik',
      distance: '45 km (Farm Gate Pickup Available)',
      paymentTerms: '100% Escrow Guaranteed Instant Pay',
      preferredDropHub: 'Hadapsar Processing Hub, Gate 2, Pune',
    },
    {
      id: 'OFF-902',
      buyerId: 'BUY-2026-PN09',
      buyer: 'Metro Wholesale Sourcing Hub',
      buyerMobile: '+91 9855512345',
      crop: 'Onion (Grade A)',
      cropKey: 'onion',
      maxQty: 150,
      defaultQty: 40,
      unit: 'Quintals',
      price: 1850,
      priceStr: '₹1,850/q',
      trust: '92/100',
      badge: 'Wholesale Chain',
      district: 'Pune',
      distance: '60 km (Truck Pickup Available)',
      paymentTerms: 'APMC Fast Escrow Clearance',
      preferredDropHub: 'Chakan Distribution Center Phase 2, Pune',
    },
    {
      id: 'OFF-903',
      buyerId: 'BUY-2026-MB04',
      buyer: 'Sahyadri Agro Exporters',
      buyerMobile: '+91 9811122334',
      crop: 'Onion (Export Super 55mm+)',
      cropKey: 'onion',
      maxQty: 500,
      defaultQty: 100,
      unit: 'Quintals',
      price: 1980,
      priceStr: '₹1,980/q',
      trust: '98/100',
      badge: 'Export Consortium',
      district: 'Navi Mumbai',
      distance: '95 km (Reefer Truck Pickup)',
      paymentTerms: 'Export Grade Escrow Guarantee',
      preferredDropHub: 'JNPT Cold Chain Terminal, Navi Mumbai',
    },
    {
      id: 'OFF-904',
      buyerId: 'BUY-2026-LT05',
      buyer: 'Tata Sampann Oil & Processing',
      buyerMobile: '+91 9833445566',
      crop: 'Soybean (JS-335 Yellow)',
      cropKey: 'soybean',
      maxQty: 400,
      defaultQty: 80,
      unit: 'Quintals',
      price: 4780,
      priceStr: '₹4,780/q',
      trust: '99/100',
      badge: 'Corporate Processing FMCG',
      district: 'Latur',
      distance: '25 km (Direct Agro-Hub Delivery)',
      paymentTerms: 'Instant T+0 Bank Settlement',
      preferredDropHub: 'Ausa Industrial Processing Plant, Latur',
    },
    {
      id: 'OFF-905',
      buyerId: 'BUY-2026-PN10',
      buyer: 'Reliance Retail Fresh Sourcing',
      buyerMobile: '+91 9877788899',
      crop: 'Tomato (Hybrid Firm Red)',
      cropKey: 'tomato',
      maxQty: 250,
      defaultQty: 50,
      unit: 'Quintals',
      price: 3250,
      priceStr: '₹3,250/q',
      trust: '95/100',
      badge: 'Retail Chain',
      district: 'Pune',
      distance: '35 km (Daily Morning Pickup)',
      paymentTerms: 'Escrow Protected Bank Transfer',
      preferredDropHub: 'Junnar Aggregation Terminal, Pune',
    },
  ];

  const refreshDeals = () => {
    setDeals([...dealService.getFarmerDeals(user?.id)]);
  };

  useEffect(() => {
    refreshDeals();
    const handleUpdate = () => refreshDeals();
    window.addEventListener('krishak_deals_updated', handleUpdate);
    return () => window.removeEventListener('krishak_deals_updated', handleUpdate);
  }, [user]);

  const filteredBuyers = registeredBuyersList.filter((b) => {
    const matchesCrop = selectedCropFilter === 'all' || b.cropKey === selectedCropFilter;
    const matchesSearch =
      b.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  const handleOpenRequestModal = (offer) => {
    setSelectedOfferForRequest(offer);
    setRequestQty(offer.defaultQty || 60);
  };

  const handleConfirmFarmerRequest = async (e) => {
    if (e) e.preventDefault();
    if (!selectedOfferForRequest) return;

    const res = await dealService.createFarmerRequest({
      farmerId: user?.id || 'FARM-2026-MH01',
      farmerName: user?.name || 'Rahul Jadhav',
      farmerMobile: farmerMobile || user?.mobile || '+91 9876543210',
      farmerPickupAddress: farmerPickupAddress || 'Gat No. 42, Farm Shed, Ausa, Latur District, Maharashtra',
      buyerId: selectedOfferForRequest.buyerId,
      buyerName: selectedOfferForRequest.buyer,
      buyerMobile: selectedOfferForRequest.buyerMobile,
      crop: selectedOfferForRequest.crop,
      cropKey: selectedOfferForRequest.cropKey,
      quantity: requestQty,
      unit: selectedOfferForRequest.unit,
      pricePerUnit: selectedOfferForRequest.price,
    });

    if (res.success) {
      showToast(
        `✓ Deal Request Sent to ${selectedOfferForRequest.buyer}! The buyer will approve and assign their drop location.`,
        'success'
      );
      setSelectedOfferForRequest(null);
      refreshDeals();
      setActiveTab('myDeals');
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
      
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/15 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30 shadow-xs">
            <span className="live-dot"></span>
            <span>Registered Buyer Directory & Direct Bids</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Registered Buyers & Procurement Bids
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-2xl">
            Browse verified corporate buyers, wholesale chains, and exporters actively purchasing produce. Send direct sell requests with your farm-gate pickup location.
          </p>
        </div>

        <button
          onClick={() => navigate('/farmer/list-produce')}
          className="btn-shimmer px-6 py-3.5 bg-harvest-400 hover:bg-harvest-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
        >
          <span>+ List New Harvest Lot</span>
          <span>→</span>
        </button>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 ${
              activeTab === 'available'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🏪</span>
            <span>Available Registered Buyers ({filteredBuyers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('myDeals')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center space-x-2 relative ${
              activeTab === 'myDeals'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>📋</span>
            <span>My Deal Requests ({deals.length})</span>
            {deals.some((d) => d.status === 'APPROVED') && (
              <span className="h-2.5 w-2.5 rounded-full bg-harvest-400 animate-ping"></span>
            )}
          </button>
        </div>

        {/* SEARCH & CROP FILTERS FOR BUYERS TAB */}
        {activeTab === 'available' && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search buyer or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 w-full sm:w-48"
            />
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Crops</option>
              <option value="onion">Onion (कांदा)</option>
              <option value="tomato">Tomato (टोमॅटो)</option>
              <option value="soybean">Soybean (सोयाबीन)</option>
            </select>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REGISTERED BUYERS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'available' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Verified Corporate & Industrial Buyers</h2>
            <p className="text-xs text-slate-500 mt-1">
              Click <strong>"Accept Bid & Request Deal"</strong> on any buyer listing to send a direct procurement request. The buyer will approve and provide the delivery warehouse address.
            </p>
          </div>

          <div className="space-y-4">
            {filteredBuyers.map((b) => (
              <div
                key={b.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{b.buyer}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      Trust Score {b.trust}
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                      {b.badge}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                      📍 {b.district}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span><strong>Required Crop:</strong> {b.crop}</span>
                    <span>•</span>
                    <span><strong>Max Demand:</strong> {b.maxQty} {b.unit}</span>
                    <span>•</span>
                    <span><strong>Logistics:</strong> {b.distance}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">🏢 Preferred Drop Facility:</span> {b.preferredDropHub}
                    </div>
                    <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {b.paymentTerms}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2 pt-1">
                    <span className="text-2xl font-black text-emerald-700 font-mono">{b.priceStr}</span>
                    <span className="text-xs text-slate-400 font-medium">Guaranteed Direct Take-Home Rate</span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <button
                    onClick={() => handleOpenRequestModal(b)}
                    className="btn-shimmer px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-1.5"
                  >
                    <span>Accept Bid & Request Deal</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY DEAL REQUESTS & ACTIVE CONTRACTS */}
      {/* ========================================================================= */}
      {activeTab === 'myDeals' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Your Active Sell Requests & Confirmed Deals</h2>
              <p className="text-xs text-slate-500 mt-1">
                Track status of deal requests sent to buyers, drop warehouse locations assigned by buyers, and escrow payments.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {deals.length} Total Requests
            </span>
          </div>

          {deals.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <span className="text-3xl block mb-2">📋</span>
              <div className="text-sm font-bold text-slate-700">No active deal requests sent yet</div>
              <p className="text-xs text-slate-400 mt-1">Switch to the "Available Registered Buyers" tab to send a direct request.</p>
              <button
                onClick={() => setActiveTab('available')}
                className="mt-4 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                View Available Buyers →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    deal.status === 'APPROVED'
                      ? 'border-emerald-300 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 shadow-xs'
                      : deal.status === 'PENDING_APPROVAL'
                      ? 'border-amber-300 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/30'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* LEFT INFO */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{deal.buyerName}</span>
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {deal.id}
                        </span>
                        {deal.status === 'APPROVED' ? (
                          <span className="text-xs bg-emerald-600 text-white font-black px-3 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                            <span>✓</span>
                            <span>DEAL CONFIRMED & ESCROW FUNDED</span>
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-500 text-white font-black px-3 py-0.5 rounded-full shadow-xs animate-pulse flex items-center space-x-1">
                            <span>⏳</span>
                            <span>AWAITING BUYER APPROVAL</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600">
                        <strong>Produce:</strong> {deal.quantity} {deal.unit} {deal.crop} @ <strong className="text-emerald-700 font-mono">₹{deal.pricePerUnit}/q</strong> • Total Deal Value: <strong className="text-emerald-800 font-mono font-bold">₹{deal.totalValue.toLocaleString('en-IN')}</strong>
                      </div>

                      {deal.status === 'APPROVED' ? (
                        <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200 text-xs space-y-1.5 shadow-2xs">
                          <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                            <span className="text-base">🎉</span>
                            <span>Buyer Approved Deal & Assigned Drop Warehouse Facility!</span>
                          </div>
                          <div className="text-slate-700">
                            <span className="font-bold text-slate-900">🏢 Assigned Drop Location:</span> {deal.dropLocation}
                          </div>
                          <div className="text-slate-700">
                            <span className="font-bold text-slate-900">🚚 Scheduled Farm Pickup:</span> <strong className="text-emerald-700">{deal.pickupDate}</strong> via {deal.transporterName} (Truck: {deal.vehicleNumber})
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                          <div>
                            <strong>🚜 Your Farm-Gate Pickup Address:</strong> {deal.farmerPickupAddress}
                          </div>
                          <div className="text-[11px] text-amber-800">
                            The buyer ({deal.buyerName}) has received your request and will assign their drop facility location & logistics schedule shortly.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT ACTION */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => navigate('/farmer/transactions')}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center space-x-1.5"
                      >
                        <span>🛡️</span>
                        <span>Track Escrow & Milestones</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: FARMER SENDS DEAL REQUEST TO BUYER */}
      {/* ========================================================================= */}
      {selectedOfferForRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase bg-white/20 px-2.5 py-0.5 rounded-md font-bold">
                  Send Deal Request
                </span>
                <h3 className="text-xl font-black mt-1">Request Deal with {selectedOfferForRequest.buyer}</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  The buyer will approve and provide the drop facility location.
                </p>
              </div>
              <button
                onClick={() => setSelectedOfferForRequest(null)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmFarmerRequest} className="p-6 space-y-4 text-xs">
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 flex justify-between items-center font-bold">
                <div>
                  <span className="text-slate-500 block text-[10px]">Offered Buying Rate</span>
                  <span className="text-emerald-950 text-sm">₹{selectedOfferForRequest.price}/q</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Estimated Deal Value</span>
                  <span className="text-emerald-800 text-sm font-mono font-black">
                    ₹{(requestQty * selectedOfferForRequest.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* QUANTITY */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
                  Quantity to Sell (Quintals) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedOfferForRequest.maxQty}
                  value={requestQty}
                  onChange={(e) => setRequestQty(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-900"
                  required
                />
              </div>

              {/* FARMER PICKUP ADDRESS */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
                  🚜 Your Farm-Gate Pickup Address *
                </label>
                <textarea
                  rows={2}
                  value={farmerPickupAddress}
                  onChange={(e) => setFarmerPickupAddress(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                  placeholder="Enter farm address, Gat number, village, taluka, district"
                  required
                />
              </div>

              {/* CONTACT MOBILE */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
                  Contact Mobile Number *
                </label>
                <input
                  type="text"
                  value={farmerMobile}
                  onChange={(e) => setFarmerMobile(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedOfferForRequest(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black rounded-xl shadow-lg shadow-emerald-700/25 flex items-center justify-center space-x-2"
                >
                  <span>✓ Send Request to Buyer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOffersPage;
