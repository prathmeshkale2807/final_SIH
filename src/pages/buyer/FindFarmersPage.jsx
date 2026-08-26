import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { dealService } from '../../services/dealService';

export const FindFarmersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerLot, setSelectedFarmerLot] = useState(null);
  const [bidPrice, setBidPrice] = useState(1490);
  const [bidQuantity, setBidQuantity] = useState(60);

  const farmerLots = [
    {
      id: 'LOT-2026-MH01',
      farmerId: 'FARM-2026-MH01',
      farmerName: 'Rahul Jadhav',
      mobile: '+91 9876543210',
      location: 'Ausa, Latur District, Maharashtra',
      district: 'Latur',
      crop: 'Onion (Garwa Red)',
      cropKey: 'onion',
      grade: 'Grade A (Export 55mm+)',
      quantity: 120,
      unit: 'Quintals',
      harvestDate: '24 Aug 2026',
      freshness: 'Fresh Harvest (< 48 hrs)',
      expectedPrice: 1480,
      trustScore: '98/100',
      verified: true,
      farmArea: '8.5 Acres',
      icon: '🧅',
    },
    {
      id: 'LOT-2026-NS02',
      farmerId: 'FARM-2026-NS02',
      farmerName: 'Suresh Patil',
      mobile: '+91 9823456789',
      location: 'Dindori, Nashik District, Maharashtra',
      district: 'Nashik',
      crop: 'Onion (Nashik Red)',
      cropKey: 'onion',
      grade: 'Grade A (Processing Quality)',
      quantity: 200,
      unit: 'Quintals',
      harvestDate: '23 Aug 2026',
      freshness: 'Fresh Harvest',
      expectedPrice: 1460,
      trustScore: '95/100',
      verified: true,
      farmArea: '14 Acres',
      icon: '🧅',
    },
    {
      id: 'LOT-2026-PN03',
      farmerId: 'FARM-2026-PN03',
      farmerName: 'Dattatray Shinde',
      mobile: '+91 9845012345',
      location: 'Junnar, Pune District, Maharashtra',
      district: 'Pune',
      crop: 'Tomato (Hybrid Abhinav)',
      cropKey: 'tomato',
      grade: 'Grade A (Firm Red)',
      quantity: 80,
      unit: 'Quintals',
      harvestDate: '25 Aug 2026',
      freshness: 'Freshly Picked Today',
      expectedPrice: 3200,
      trustScore: '97/100',
      verified: true,
      farmArea: '6 Acres',
      icon: '🍅',
    },
    {
      id: 'LOT-2026-LT04',
      farmerId: 'FARM-2026-LT04',
      farmerName: 'Vikas Kadam',
      mobile: '+91 9890123999',
      location: 'Nilanga, Latur District, Maharashtra',
      district: 'Latur',
      crop: 'Soybean (JS-335 Yellow)',
      cropKey: 'soybean',
      grade: 'Grade A (Moisture < 10%)',
      quantity: 150,
      unit: 'Quintals',
      harvestDate: '21 Aug 2026',
      freshness: 'Clean Dry Storage',
      expectedPrice: 4700,
      trustScore: '94/100',
      verified: true,
      farmArea: '12 Acres',
      icon: '🌱',
    },
  ];

  const filteredLots = farmerLots.filter((lot) => {
    const matchesCrop = selectedCrop === 'all' || lot.cropKey === selectedCrop;
    const matchesDistrict = selectedDistrict === 'all' || lot.district === selectedDistrict;
    const matchesSearch =
      lot.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesDistrict && matchesSearch;
  });

  const handleOpenBidModal = (lot) => {
    setSelectedFarmerLot(lot);
    setBidPrice(lot.expectedPrice || 1490);
    setBidQuantity(Math.min(60, lot.quantity));
  };

  const handleSubmitBid = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFarmerLot) return;

    await dealService.createFarmerRequest({
      farmerId: selectedFarmerLot.farmerId,
      farmerName: selectedFarmerLot.farmerName,
      farmerMobile: selectedFarmerLot.mobile,
      farmerPickupAddress: selectedFarmerLot.location,
      buyerId: user?.id || 'BUY-2026-PN08',
      buyerName: user?.businessName || 'AgroFresh Processors Ltd.',
      crop: selectedFarmerLot.crop,
      cropKey: selectedFarmerLot.cropKey,
      quantity: bidQuantity,
      unit: selectedFarmerLot.unit,
      pricePerUnit: bidPrice,
    });

    showToast(
      `✓ Direct Procurement Bid of ₹${bidPrice}/q sent to ${selectedFarmerLot.farmerName}!`,
      'success'
    );
    setSelectedFarmerLot(null);
    navigate('/buyer/dashboard');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/15 border border-blue-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white border border-white/30 shadow-xs">
            <span className="live-dot bg-emerald-400"></span>
            <span>Direct Farm-Gate Sourcing Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Find Verified Farmer Lots & Send Direct Bids
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            Search active farmer harvest lots across Maharashtra. Bypass intermediary mandi margins with farm-gate pickup & escrow protection.
          </p>
        </div>

        <button
          onClick={() => navigate('/buyer/post-requirement')}
          className="px-5 py-3 bg-white text-blue-900 hover:bg-blue-50 font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 flex-shrink-0"
        >
          <span>+ Post Tender</span>
          <span>→</span>
        </button>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* SEARCH BAR */}
          <div className="relative sm:col-span-1">
            <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farmer, crop, village..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white text-slate-800"
            />
          </div>

          {/* CROP FILTER */}
          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white"
            >
              <option value="all">All Crops (सर्व पिके)</option>
              <option value="onion">🧅 Onion (कांदा)</option>
              <option value="tomato">🍅 Tomato (टोमॅटो)</option>
              <option value="soybean">🌱 Soybean (सोयाबीन)</option>
              <option value="potato">🥔 Potato (बटाटा)</option>
            </select>
          </div>

          {/* DISTRICT FILTER */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:bg-white"
            >
              <option value="all">All Districts (महाराष्ट्र)</option>
              <option value="Nashik">Nashik (नाशिक)</option>
              <option value="Pune">Pune (पुणे)</option>
              <option value="Latur">Latur (लातूर)</option>
              <option value="Solapur">Solapur (सोलापूर)</option>
            </select>
          </div>
        </div>
      </div>

      {/* FARMER LOTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLots.map((lot) => (
          <div
            key={lot.id}
            className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-200/80 hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* TOP HEADER */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-2xl flex items-center justify-center shadow-xs">
                    {lot.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{lot.crop}</h3>
                    <p className="text-xs text-slate-500 font-medium">{lot.grade}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Trust {lot.trustScore}
                  </span>
                </div>
              </div>

              {/* FARMER DETAILS */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer:</span>
                  <strong className="text-slate-900">{lot.farmerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farm Location:</span>
                  <span className="text-slate-700 font-medium truncate max-w-[200px]">{lot.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Lot:</span>
                  <strong className="text-blue-900 font-mono text-sm">{lot.quantity} {lot.unit}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Base Price:</span>
                  <strong className="text-emerald-700 font-mono text-sm">₹{lot.expectedPrice}/q</strong>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => handleOpenBidModal(lot)}
                className="btn-shimmer flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>🤝</span>
                <span>Send Direct Procurement Bid</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: SUBMIT DIRECT SOURCING BID */}
      {selectedFarmerLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase bg-white/20 px-2.5 py-0.5 rounded-md font-bold">
                  Direct Procurement Bid
                </span>
                <h3 className="text-xl font-black mt-1">Bid on {selectedFarmerLot.crop}</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  Direct offer to {selectedFarmerLot.farmerName} ({selectedFarmerLot.location})
                </p>
              </div>
              <button
                onClick={() => setSelectedFarmerLot(null)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBid} className="p-6 space-y-4 text-xs">
              <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 flex justify-between items-center font-bold">
                <div>
                  <span className="text-slate-500 block text-[10px]">Farmer Expected</span>
                  <span className="text-blue-950 text-sm">₹{selectedFarmerLot.expectedPrice}/q</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Total Bid Value</span>
                  <span className="text-emerald-700 text-sm font-mono font-black">
                    ₹{(bidPrice * bidQuantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
                  Your Offered Price (₹ per Quintal) *
                </label>
                <input
                  type="number"
                  required
                  value={bidPrice}
                  onChange={(e) => setBidPrice(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-800 block text-xs uppercase tracking-wider">
                  Quantity Required (Quintals) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedFarmerLot.quantity}
                  required
                  value={bidQuantity}
                  onChange={(e) => setBidQuantity(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedFarmerLot(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-1.5"
                >
                  <span>✓ Send Bid with Escrow Guarantee</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindFarmersPage;
