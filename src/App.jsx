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

  // Startup Splash Screen: Always shown every time website is opened
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!isAuthenticated) {
      navigate('/login/farmer');
    }
  };

  // Pure Full-Screen Splash Screen without Navbar
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
      <ScrollToTop />

      {/* 2. GLOBAL TOAST NOTIFICATION - SOLID OPAQUE */}
      {toast && (
        <div className="fixed top-20 right-4 z-[100] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-slate-950/40 flex items-center space-x-3 text-xs font-bold border-2 border-slate-700 animate-fade-in-up">
          <span className="text-base">🔔</span>
          <span className="font-semibold">{toast.message}</span>
          <button onClick={clearToast} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
            ✕
          </button>
        </div>
      )}

      <Routes>
        {/* DEDICATED SPLASH ROUTE */}
        <Route path="/splash" element={<SplashScreen onComplete={() => navigate('/login/farmer')} />} />

        {/* PUBLIC WEBSITE (FULL-WIDTH MODERN LANDING EXPERIENCE AT /) */}
        <Route path="/" element={<><Navbar /><div className="animate-fade-in"><LandingPage /></div></>} />
        <Route path="/welcome" element={<Navigate to="/" replace />} />

        {/* AUTHENTICATION ROUTES */}
        <Route path="/login" element={<Navigate to="/login/farmer" replace />} />
        <Route path="/login/farmer" element={<div className="animate-fade-in"><FarmerLogin /></div>} />
        <Route path="/register/farmer" element={<div className="animate-fade-in"><FarmerRegister /></div>} />
        <Route path="/login/buyer" element={<div className="animate-fade-in"><BuyerLogin /></div>} />
        <Route path="/register/buyer" element={<div className="animate-fade-in"><BuyerRegister /></div>} />
        <Route path="/login/admin" element={<div className="animate-fade-in"><AdminLogin /></div>} />

        {/* FPO HUB (PUBLIC / COMMUNITY) */}
        <Route path="/fpo" element={<><Navbar /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"><FpoDashboard /></div></>} />

        {/* AUTHENTICATED ADMIN PORTAL */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<><Navbar /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in"><AdminDashboard /></div></>} />
        </Route>

        {/* AUTHENTICATED FARMER ROUTES */}
        <Route element={<ProtectedRoute allowedRole="farmer" />}>
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route path="dashboard" element={<div className="animate-fade-in"><FarmerDashboard /></div>} />
            <Route path="list-produce" element={<div className="animate-fade-in"><ListProducePage /></div>} />
            <Route path="best-deal" element={<div className="animate-fade-in"><BestDealPage /></div>} />
            <Route path="markets" element={<div className="animate-fade-in"><MarketIntelligencePage /></div>} />
            <Route path="lots" element={<div className="animate-fade-in"><MyLotsPage /></div>} />
            <Route path="offers" element={<div className="animate-fade-in"><BuyerOffersPage /></div>} />
            <Route path="transactions" element={<div className="animate-fade-in"><TransactionsPage /></div>} />
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
