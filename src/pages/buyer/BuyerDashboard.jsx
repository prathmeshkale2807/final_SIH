import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { dealService } from '../../services/dealService';

export const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const [deals, setDeals] = useState(() => dealService.getDeals());
  const [selectedDealForApproval, setSelectedDealForApproval] = useState(null);
  const [dropLocation, setDropLocation] = useState(
    'AgroFresh Central Processing Hub, Gate 2, Hadapsar Industrial Area, Pune, Maharashtra 411028'
  );
  const [pickupDate, setPickupDate] = useState('Tomorrow, 08:30 AM');
  const [transporterName, setTransporterName] = useState('Krishak Verified Logistics (Cold Express)');
  const [vehicleNumber, setVehicleNumber] = useState('MH-12-TR-8821');
  const [driverPhone, setDriverPhone] = useState('+91 9890123456');
  const [notes, setNotes] = useState('Ensure dry moisture packaging. Unloading dock 3 reserved.');

  const refreshDeals = () => {
    setDeals([...dealService.getDeals()]);
  };

  useEffect(() => {
    refreshDeals();
    const handleUpdate = () => refreshDeals();
    window.addEventListener('krishak_deals_updated', handleUpdate);
    return () => window.removeEventListener('krishak_deals_updated', handleUpdate);
  }, []);

  const pendingDeals = deals.filter((d) => d.status === 'PENDING_APPROVAL');
  const approvedDeals = deals.filter((d) => d.status === 'APPROVED' || d.status === 'IN_TRANSIT');

  const handleOpenApprovalModal = (deal) => {
    setSelectedDealForApproval(deal);
    setDropLocation(
      deal.dropLocation && !deal.dropLocation.includes('To be assigned')
        ? deal.dropLocation
        : 'AgroFresh Central Processing Hub, Gate 2, Hadapsar Industrial Area, Pune, Maharashtra 411028'
    );
    setPickupDate(
      deal.pickupDate && !deal.pickupDate.includes('To be scheduled')
        ? deal.pickupDate
        : 'Tomorrow, 08:30 AM'
    );
  };

  const handleConfirmApproval = async (e) => {
    if (e) e.preventDefault();
    if (!selectedDealForApproval) return;

    const res = await dealService.approveDealByBuyer(selectedDealForApproval.id, {
      dropLocation,
      pickupDate,
      transporterName,
      vehicleNumber,
      driverPhone,
      notes,
    });

    if (res.success) {
      showToast(
        `✓ Deal Approved! Drop location assigned & Transporter ${vehicleNumber} scheduled for farm pickup.`,
        'success'
      );
      setSelectedDealForApproval(null);
      refreshDeals();
    }
  };

  const handleQuickApprove = async (deal) => {
    const res = await dealService.approveDealByBuyer(deal.id, {
      dropLocation: 'AgroFresh Central Processing Hub, Gate 2, Hadapsar Industrial Area, Pune, Maharashtra 411028',
      pickupDate: 'Tomorrow, 08:30 AM',
      transporterName: 'Krishak Verified Logistics (Cold Express)',
      vehicleNumber: 'MH-12-TR-8821',
      driverPhone: '+91 9890123456',
    });

    if (res.success) {
      showToast(`✓ Deal with ${deal.farmerName} approved! Escrow funded ₹${deal.totalValue.toLocaleString('en-IN')}.`, 'success');
      refreshDeals();
    }
  };

  const handleReject = async (dealId) => {
    const res = await dealService.rejectDealByBuyer(dealId);
    if (res.success) {
      showToast('Deal request declined.', 'info');
      refreshDeals();
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
      
      {/* 1. ENTERPRISE PROCUREMENT BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/15 border border-blue-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30 shadow-xs">
            <span className="live-dot bg-emerald-400"></span>
            <span>Enterprise Procurement Portal • Verified Buyer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.businessName || 'AgroFresh Processors Ltd.'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            📍 Pune APMC Yard Hub • Verified Trust Score: <strong className="text-emerald-300 font-bold">96/100</strong> • Escrow Safety Guarantee
          </p>
        </div>

        <button
          onClick={() => navigate('/buyer/post-requirement')}
          className="btn-shimmer px-6 py-3.5 bg-white text-blue-900 hover:bg-blue-50 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center space-x-2 flex-shrink-0"
        >
          <span>+ Post Sourcing Tender</span>
          <span>→</span>
        </button>
      </div>

      {/* 2. KPI METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-amber-300 transition-all space-y-1.5 relative overflow-hidden">
          {pendingDeals.length > 0 && (
            <span className="absolute top-4 right-4 h-3 w-3 rounded-full bg-amber-500 animate-ping"></span>
          )}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Farmer Requests</div>
          <div className="text-3xl font-black text-amber-600 font-mono flex items-center space-x-2">
            <span>{pendingDeals.length}</span>
            {pendingDeals.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">Action Required</span>
            )}
          </div>
          <p className="text-xs text-slate-500">Farmers awaiting your drop location & approval</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-emerald-300 transition-all space-y-1.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmed Escrow Deals</div>
          <div className="text-3xl font-black text-emerald-600 font-mono">
            {approvedDeals.length}
          </div>
          <p className="text-xs text-emerald-700 font-semibold">
            ₹{approvedDeals.reduce((acc, d) => acc + d.totalValue, 0).toLocaleString('en-IN')} Total Procured
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xs hover:shadow-md border border-slate-200/80 hover:border-blue-300 transition-all space-y-1.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sourcing Tenders</div>
          <div className="text-3xl font-black text-blue-700 font-mono">2</div>
          <p className="text-xs text-slate-500">200Q Onion & 80Q Soybean Active</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INCOMING FARMER REQUESTS (CRITICAL WORKFLOW COMPONENT) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">📩</span>
              <h2 className="text-xl font-extrabold text-slate-900">Incoming Farmer Sell Requests</h2>
              <span className="bg-amber-100 text-amber-900 font-black text-xs px-2.5 py-0.5 rounded-full">
                {pendingDeals.length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review harvest lots requested by farmers, approve contracts, and assign your processing warehouse drop facility.
            </p>
          </div>
        </div>

        {pendingDeals.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="text-3xl block mb-2">🌾</span>
            <div className="text-sm font-bold text-slate-700">No pending farmer requests</div>
            <p className="text-xs text-slate-400 mt-1">When farmers request to sell harvest to your company, they will appear here for approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingDeals.map((deal) => (
              <div
                key={deal.id}
                className="p-5 sm:p-6 rounded-2xl border-2 border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  {/* FARMER & CROP HEADER */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{deal.farmerName}</span>
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-md">
                      {deal.farmerId}
                    </span>
                    <span className="text-xs bg-amber-200/80 text-amber-950 font-black px-2.5 py-0.5 rounded-full animate-pulse">
                      ⏳ AWAITING YOUR APPROVAL
                    </span>
                  </div>

                  {/* PRODUCE SPECIFICATIONS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-amber-200/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Crop & Variety</span>
                      <strong className="text-slate-900 text-sm">{deal.crop}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Lot Quantity</span>
                      <strong className="text-slate-900 text-sm">{deal.quantity} {deal.unit}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Offered Rate</span>
                      <strong className="text-emerald-700 font-mono text-sm">₹{deal.pricePerUnit}/q</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Deal Value</span>
                      <strong className="text-emerald-800 font-mono text-sm font-black">
                        ₹{deal.totalValue.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* FARMER PICKUP LOCATION */}
                  <div className="flex items-start space-x-2 text-xs text-slate-600 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80">
                    <span className="text-base flex-shrink-0">🚜</span>
                    <div>
                      <span className="font-bold text-emerald-950">Farmer Farm-Gate Pickup Address:</span>
                      <div className="text-slate-700 mt-0.5 font-medium">{deal.farmerPickupAddress}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">📞 Contact: {deal.farmerMobile}</div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 w-full lg:w-60 flex-shrink-0">
                  <button
                    onClick={() => handleOpenApprovalModal(deal)}
                    className="btn-shimmer px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-700/25 transition-all text-center flex items-center justify-center space-x-1.5"
                  >
                    <span>🏢</span>
                    <span>Approve & Assign Drop</span>
                  </button>

                  <button
                    onClick={() => handleQuickApprove(deal)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all text-center"
                  >
                    Quick Approve (Default)
                  </button>

                  <button
                    onClick={() => handleReject(deal.id)}
                    className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-xl transition-all text-center"
                  >
                    Decline Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. CONFIRMED IN-TRANSIT & ESCROW DEALS (TRACKING DROP DELIVERIES) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🚚</span>
              <h2 className="text-xl font-extrabold text-slate-900">Confirmed Deliveries & In-Transit Orders</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active procurement contracts with assigned drop facilities, transporter dispatch, and milestone escrow locks.
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-900 font-bold text-xs px-3 py-1 rounded-full">
            {approvedDeals.length} Active Orders
          </span>
        </div>

        <div className="space-y-4">
          {approvedDeals.map((deal) => (
            <div
              key={deal.id}
              className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-r from-white via-emerald-50/20 to-white shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-extrabold text-slate-900 text-base">{deal.crop} • {deal.quantity} {deal.unit}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded">
                    {deal.escrowId}
                  </span>
                </div>
                <div className="text-sm font-black text-emerald-700 font-mono">
                  ₹{deal.totalValue.toLocaleString('en-IN')} (Escrow Protected 🛡️)
                </div>
              </div>

              {/* ROUTE COMPARISON (PICKUP ➔ DROP) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">📍 Farmer Farm Pickup</span>
                  <div className="font-bold text-slate-900 mt-0.5">{deal.farmerName} (+91 {deal.farmerMobile})</div>
                  <div className="text-slate-600 mt-0.5">{deal.farmerPickupAddress}</div>
                  <div className="text-emerald-700 font-bold mt-1 text-[11px]">⏰ Pickup Window: {deal.pickupDate}</div>
                </div>

                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80">
                  <span className="text-blue-500 font-bold block uppercase text-[10px]">🏢 Assigned Buyer Drop Facility</span>
                  <div className="font-bold text-blue-950 mt-0.5">{user?.businessName || deal.buyerName}</div>
                  <div className="text-slate-700 mt-0.5">{deal.dropLocation}</div>
                  <div className="text-blue-700 font-bold mt-1 text-[11px]">
                    🚛 Vehicle: {deal.vehicleNumber} • Driver: {deal.driverPhone || 'Assigned'}
                  </div>
                </div>
              </div>

              {/* MILESTONE PILL STRIP */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                {deal.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${
                      m.done
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <span>{m.done ? '✓' : '○'}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL: APPROVE & ASSIGN DROP LOCATION */}
      {/* ========================================================================= */}
      {selectedDealForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase bg-white/20 px-2.5 py-0.5 rounded-md font-bold">
                  Procurement Order Approval
                </span>
                <h3 className="text-xl font-black mt-1">Assign Drop Location & Confirm Deal</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Confirming deal with {selectedDealForApproval.farmerName} for {selectedDealForApproval.quantity} {selectedDealForApproval.unit} {selectedDealForApproval.crop}
                </p>
              </div>
              <button
                onClick={() => setSelectedDealForApproval(null)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleConfirmApproval} className="p-6 space-y-4 text-xs">
              {/* DEAL SUMMARY */}
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex justify-between items-center font-bold">
                <div>
                  <span className="text-slate-500 block text-[10px]">Agreed Rate & Escrow Lock</span>
                  <span className="text-emerald-950 text-sm">₹{selectedDealForApproval.pricePerUnit}/q • ₹{selectedDealForApproval.totalValue.toLocaleString('en-IN')} Total</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Farmer Pickup</span>
                  <span className="text-slate-800 text-xs">Ausa, Latur (Farm Gate)</span>
                </div>
              </div>

              {/* DROP WAREHOUSE ADDRESS */}
              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
                  🏢 Warehouse / Processing Unit Drop Location *
                </label>
                <textarea
                  rows={2}
                  value={dropLocation}
                  onChange={(e) => setDropLocation(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs font-medium text-slate-900"
                  placeholder="Enter full address of warehouse where produce will be unloaded"
                  required
                />
              </div>

              {/* PICKUP SCHEDULE & TRANSPORTER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px]">⏰ Scheduled Pickup Date/Time</label>
                  <input
                    type="text"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                    placeholder="e.g. Tomorrow, 08:30 AM"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px]">🚚 Logistics Vehicle Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs font-mono"
                    placeholder="e.g. MH-12-TR-8821"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px]">Transporter / Logistics Partner</label>
                  <input
                    type="text"
                    value={transporterName}
                    onChange={(e) => setTransporterName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px]">Driver Mobile Contact</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">Special Unloading Instructions</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="e.g. Bring tare weight receipt, unload at Dock 3"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedDealForApproval(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black rounded-xl shadow-lg shadow-emerald-700/25 flex items-center justify-center space-x-2"
                >
                  <span>✓</span>
                  <span>Confirm Deal & Fund Escrow (₹{selectedDealForApproval.totalValue.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
