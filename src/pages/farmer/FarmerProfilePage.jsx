import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { firestoreService } from '../../services/firestoreService';

export const FarmerProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useApp ? useApp() : { showToast: () => {} };

  const getComputedLocation = (u) => {
    if (u?.location) return u.location;
    const parts = [u?.village, u?.taluka, u?.district, u?.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Maharashtra';
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.farmerName || user?.businessName || 'Farmer',
    mobile: user?.mobile || '',
    location: getComputedLocation(user),
    primaryCrop: user?.primaryCrop || 'Onion',
    landArea: user?.landArea ? (String(user.landArea).includes('Acres') ? user.landArea : `${user.landArea} Acres`) : '5 Acres',
    bankName: user?.bankName || 'State Bank of India',
    accountNo: user?.accountNo || '•••• •••• ' + (user?.mobile ? user.mobile.slice(-4) : '4019'),
    ifsc: user?.ifsc || 'SBIN0001824',
    escrowKyc: 'KYC Verified (Direct Farm Escrow Linked ✓)',
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || user.farmerName || user.businessName || prev.name,
        mobile: user.mobile || prev.mobile,
        location: getComputedLocation(user),
        primaryCrop: user.primaryCrop || prev.primaryCrop,
        landArea: user.landArea ? (String(user.landArea).includes('Acres') ? user.landArea : `${user.landArea} Acres`) : prev.landArea,
      }));
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    
    // Save to Cloud Firestore directly
    await firestoreService.saveFarmer({
      ...user,
      ...profileData,
    });

    if (updateUser) {
      updateUser(profileData);
    }
    
    showToast('✓ Profile & Farm details updated successfully!', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-8 animate-fade-in">
      
      {/* 1. TOP PROFILE HERO CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 text-center space-y-4 relative overflow-hidden">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white text-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/25">
          {user?.role === 'buyer' ? '🏪' : '🌾'}
        </div>

        <div>
          <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs mb-2">
            <span>✓</span>
            <span>KRISHAK Verified {user?.role === 'buyer' ? 'Buyer' : 'Farmer'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">{profileData.name}</h1>
          <p className="text-xs font-mono text-emerald-700 font-bold mt-0.5">
            ID: {user?.farmerId || user?.shopId || user?.id || (user?.role === 'buyer' ? 'Buyer Account' : 'Farmer Account')}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95"
          >
            <span>✏️</span>
            <span>Edit Farm Details</span>
          </button>
        </div>
      </div>

      {/* 2. FARM & CONTACT SPECIFICATIONS */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
            {user?.role === 'buyer' ? 'Enterprise Procurement Details' : 'Farm Land & Crop Details'}
          </h2>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            Active Season 2026
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="flex justify-between py-2.5">
            <span className="text-slate-500">Registered Mobile:</span>
            <span className="font-bold text-slate-900 font-mono">+91 {profileData.mobile}</span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-slate-500">Farm Gate Address:</span>
            <span className="font-bold text-slate-900">{profileData.location}</span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-slate-500">Primary Crop Cultivated:</span>
            <span className="font-bold text-emerald-700">{profileData.primaryCrop}</span>
          </div>
          <div className="flex justify-between py-2.5">
            <span className="text-slate-500">Total Cultivable Area:</span>
            <span className="font-bold text-slate-900">{profileData.landArea}</span>
          </div>
        </div>
      </div>

      {/* 3. DIRECT ESCROW & BANK SETTLEMENT ACCOUNT */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              🛡️ Direct Escrow Payout Bank Account
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Escrow release funds are transferred directly into this account upon delivery verification.
            </p>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2.5 py-1 rounded-full">
            KYC VERIFIED ✓
          </span>
        </div>

        <div className="p-4 bg-gradient-to-r from-emerald-50 via-slate-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Bank Name:</span>
            <strong className="text-slate-900">{profileData.bankName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account Number:</span>
            <strong className="text-slate-900 font-mono">{profileData.accountNo}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">IFSC Code:</span>
            <strong className="text-slate-900 font-mono">{profileData.ifsc}</strong>
          </div>
        </div>
      </div>

      {/* 4. LANGUAGE PREFERENCE */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
        <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
          🌐 Preferred App Language
        </h2>
        <LanguageSwitcher variant="pills" />
      </div>

      {/* 5. LOGOUT BUTTON */}
      <button
        onClick={logout}
        className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-sm rounded-2xl border border-rose-200 transition-all flex items-center justify-center space-x-2 active:scale-98"
      >
        <i className="ri-logout-box-r-line text-lg"></i>
        <span>Sign Out of KRISHAK Session</span>
      </button>

      {/* MODAL: EDIT PROFILE */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">Edit Farm Profile</h3>
                <p className="text-xs text-emerald-100 mt-0.5">Update location and farm parameters</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Farm Gate Pickup Address</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Primary Crop</label>
                  <input
                    type="text"
                    value={profileData.primaryCrop}
                    onChange={(e) => setProfileData({ ...profileData, primaryCrop: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Cultivable Land Area</label>
                  <input
                    type="text"
                    value={profileData.landArea}
                    onChange={(e) => setProfileData({ ...profileData, landArea: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg shadow-emerald-700/25"
                >
                  Save Changes ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfilePage;
