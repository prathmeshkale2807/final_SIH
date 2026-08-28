import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SplashScreen } from './components/common/SplashScreen';
import { LandingPage } from './pages/public/LandingPage';
import { FarmerLogin } from './pages/auth/FarmerLogin';
import { FarmerRegister } from './pages/auth/FarmerRegister';
import { BuyerLogin } from './pages/auth/BuyerLogin';
import { BuyerRegister } from './pages/auth/BuyerRegister';
import { AdminLogin } from './pages/auth/AdminLogin';
import { FarmerLayout } from './components/layout/FarmerLayout';
import { BuyerLayout } from './components/layout/BuyerLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { ListProducePage } from './pages/farmer/ListProducePage';
import { BestDealPage } from './pages/farmer/BestDealPage';
import { MarketIntelligencePage } from './pages/farmer/MarketIntelligencePage';
import { MyLotsPage } from './pages/farmer/MyLotsPage';
import { MyCropsPage } from './pages/farmer/MyCropsPage';
import { ContractsPage } from './pages/farmer/ContractsPage';
import { OrdersSalesPage } from './pages/farmer/OrdersSalesPage';
import { PaymentsWalletPage } from './pages/farmer/PaymentsWalletPage';
import { WeatherForecastPage } from './pages/farmer/WeatherForecastPage';
import { AdvisoryInsightsPage } from './pages/farmer/AdvisoryInsightsPage';
import { ResourcesPage } from './pages/farmer/ResourcesPage';
import { SupportPage } from './pages/farmer/SupportPage';
import { BuyerOffersPage } from './pages/farmer/BuyerOffersPage';
import { TransactionsPage } from './pages/farmer/TransactionsPage';
import { FarmerProfilePage } from './pages/farmer/FarmerProfilePage';

import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { PostRequirementPage } from './pages/buyer/PostRequirementPage';
import { FindFarmersPage } from './pages/buyer/FindFarmersPage';
import { FpoDashboard } from './pages/fpo/FpoDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';

// Auto scroll-to-top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export const App = () => {
  const { toast, clearToast } = useApp();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Show splash screen on first visit or startup
  const [showSplash, setShowSplash] = useState(true);

  // If splash is active, isolate and render SplashScreen exclusively
  if (showSplash) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <ScrollToTop />

      {/* Global Toast Notification System */}
      {toast && (
        <div className="fixed top-5 right-5 z-[99999] flex items-center space-x-3 bg-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-xl animate-fade-in-down max-w-md">
          <span className="text-xl">
            {toast.type === 'success' ? '🌱' : toast.type === 'error' ? '⚠️' : 'ℹ️'}
          </span>
          <p className="text-xs font-semibold flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={clearToast}
            className="text-slate-400 hover:text-white transition-colors text-base font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      <Routes>
        {/* PUBLIC ACCESS ROUTES */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/login/farmer" element={<FarmerLogin />} />
        <Route path="/register/farmer" element={<FarmerRegister />} />
        <Route path="/login/buyer" element={<BuyerLogin />} />
        <Route path="/register/buyer" element={<BuyerRegister />} />
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* AUTHENTICATED ADMIN PORTAL */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<><Navbar /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"><AdminDashboard /></div></>} />
        </Route>

        {/* AUTHENTICATED FARMER ROUTES */}
        <Route element={<ProtectedRoute allowedRole="farmer" />}>
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route path="dashboard" element={<div className="animate-fade-in"><FarmerDashboard /></div>} />
            <Route path="markets" element={<div className="animate-fade-in"><MarketIntelligencePage /></div>} />
            <Route path="crops" element={<div className="animate-fade-in"><MyCropsPage /></div>} />
            <Route path="lots" element={<div className="animate-fade-in"><MyLotsPage /></div>} />
            <Route path="list-produce" element={<div className="animate-fade-in"><ListProducePage /></div>} />
            <Route path="sell" element={<div className="animate-fade-in"><ListProducePage /></div>} />
            <Route path="contracts" element={<div className="animate-fade-in"><ContractsPage /></div>} />
            <Route path="orders" element={<div className="animate-fade-in"><OrdersSalesPage /></div>} />
            <Route path="orders-sales" element={<div className="animate-fade-in"><OrdersSalesPage /></div>} />
            <Route path="offers" element={<div className="animate-fade-in"><BuyerOffersPage /></div>} />
            <Route path="wallet" element={<div className="animate-fade-in"><PaymentsWalletPage /></div>} />
            <Route path="transactions" element={<div className="animate-fade-in"><PaymentsWalletPage /></div>} />
            <Route path="weather" element={<div className="animate-fade-in"><WeatherForecastPage /></div>} />
            <Route path="advisory" element={<div className="animate-fade-in"><AdvisoryInsightsPage /></div>} />
            <Route path="best-deal" element={<div className="animate-fade-in"><BestDealPage /></div>} />
            <Route path="resources" element={<div className="animate-fade-in"><ResourcesPage /></div>} />
            <Route path="support" element={<div className="animate-fade-in"><SupportPage /></div>} />
            <Route path="profile" element={<div className="animate-fade-in"><FarmerProfilePage /></div>} />
          </Route>
        </Route>

        {/* AUTHENTICATED BUYER ROUTES */}
        <Route element={<ProtectedRoute allowedRole="buyer" />}>
          <Route path="/buyer" element={<BuyerLayout />}>
            <Route path="dashboard" element={<div className="animate-fade-in"><BuyerDashboard /></div>} />
            <Route path="post-requirement" element={<div className="animate-fade-in"><PostRequirementPage /></div>} />
            <Route path="find-farmers" element={<div className="animate-fade-in"><FindFarmersPage /></div>} />
            <Route path="shipments" element={<div className="animate-fade-in"><TransactionsPage /></div>} />
            <Route path="profile" element={<div className="animate-fade-in"><FarmerProfilePage /></div>} />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
