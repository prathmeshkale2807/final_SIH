import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SplashScreen = ({ onComplete }) => {
  const navigate = useNavigate();
  const [fadingOut, setFadingOut] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 390));

  // Responsive dynamic resize listener for mobile devices
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 8 Topic-Related Agricultural Feature Nodes
  const featureNodes = [
    { id: 1, title: 'Soil Moisture', mrTitle: 'ओलावा', icon: '💧', angle: -90 },     // Top
    { id: 2, title: 'Connectivity', mrTitle: 'कनेक्टिव्हिटी', icon: '📶', angle: -45 },
    { id: 3, title: 'Weather & Temp', mrTitle: 'हवामान', icon: '🌡️', angle: 0 },      // Right
    { id: 4, title: 'Farm Alerts', mrTitle: 'सतर्कता', icon: '⚠️', angle: 45 },
    { id: 5, title: 'Crop Health', mrTitle: 'पीक आरोग्य', icon: '🌾', angle: 90 },    // Bottom
    { id: 6, title: 'Live Mandi', mrTitle: 'बाजार भाव', icon: '📊', angle: 135 },
    { id: 7, title: 'Direct Buyers', mrTitle: 'खरेदीदार', icon: '🏢', angle: 180 },   // Left
    { id: 8, title: 'Profit Optimizer', mrTitle: 'नफा वाढवा', icon: '📈', angle: 225 },
  ];

  // Dynamically calculate orbit radius based on phone screen width
  const isSmallMobile = windowWidth < 380;
  const isMobile = windowWidth < 640;
  const orbitRadius = isSmallMobile ? 96 : isMobile ? 112 : 140;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFinish();
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleFinish = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        navigate('/login/farmer');
      }
    }, 500);
  };

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-[99999] flex flex-col justify-between items-center text-slate-900 overflow-hidden transition-all duration-800 ease-in-out select-none cursor-pointer p-4 sm:p-6 ${
        fadingOut ? 'opacity-0 scale-105 filter blur-[2px] pointer-events-none' : 'opacity-100 scale-100 filter blur-0'
      }`}
      style={{ backgroundColor: '#064e3b' }}
      title="Tap anywhere to continue"
    >
      {/* 1. CINEMATIC LUSH AGRICULTURE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/farmer_hero_bg.jpg"
          alt="Lush green agricultural crop field"
          className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.08] saturate-[1.25] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/40 to-emerald-950/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-emerald-900/40"></div>
        
        {/* Glowing Ambient Radial Auras */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-emerald-400/25 rounded-full blur-[90px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-amber-400/25 rounded-full blur-[70px] pointer-events-none"></div>
      </div>

      {/* 2. TOP HEADER BRANDING */}
      <div className="relative z-10 pt-4 sm:pt-10 text-center space-y-1.5 px-2 animate-fade-in-down">
        <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-emerald-300 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black text-emerald-950 shadow-md">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Smart Solutions for Indian Farmers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white drop-shadow-lg leading-none">
          <span className="text-white">KRISHAK</span>
          <span className="text-amber-300">-AI</span>
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 font-bold tracking-wide drop-shadow-sm">
          शेतकऱ्यांचा डिजिटल मित्र • भारत सरकार कृषी मंच
        </p>
      </div>

      {/* 3. CENTER ORBITAL SPHERE - FULLY RESPONSIVE FOR ALL PHONES */}
      <div className="relative z-10 my-auto flex items-center justify-center">
        
        {/* RADIAL CONNECTOR RINGS */}
        <div
          style={{
            width: `${orbitRadius * 2}px`,
            height: `${orbitRadius * 2}px`,
          }}
          className="absolute rounded-full border border-emerald-400/35 border-dashed animate-spin-slow pointer-events-none"
        ></div>
        <div
          style={{
            width: `${orbitRadius * 1.5}px`,
            height: `${orbitRadius * 1.5}px`,
          }}
          className="absolute rounded-full border border-harvest-400/25 pointer-events-none"
        ></div>

        {/* 8 RADIAL AGRICULTURAL FEATURE NODES */}
        {featureNodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * orbitRadius;
          const y = Math.sin(rad) * orbitRadius;

          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="absolute flex flex-col items-center justify-center transition-all duration-300 group"
            >
              {/* GLASSMORPHIC NODE BUBBLE */}
              <div className="h-7 w-7 sm:h-11 sm:w-11 rounded-full bg-white/25 backdrop-blur-xl border border-white/40 text-white flex items-center justify-center text-xs sm:text-base shadow-lg shadow-emerald-950/40 group-hover:bg-emerald-500/40 transition-all">
                <span>{node.icon}</span>
              </div>
              <span className="text-[7.5px] sm:text-[9px] font-extrabold text-white/95 bg-slate-900/85 backdrop-blur-md px-1.5 py-0.5 rounded mt-0.5 border border-white/10 whitespace-nowrap shadow-xs leading-none">
                {node.title}
              </span>
            </div>
          );
        })}

        {/* CENTRAL KRISHAK LOGO EMBLEM - SQUARE WITH CURVED EDGES */}
        <div className="relative h-24 w-24 sm:h-36 sm:w-36 rounded-3xl bg-white p-3 sm:p-4 border-3 sm:border-4 border-emerald-400/90 shadow-2xl shadow-emerald-500/30 flex flex-col items-center justify-center z-20 group hover:scale-105 transition-all duration-300 overflow-hidden">
          <img
            src="/krishak_logo.png"
            alt="Krishak Logo"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
          <div className="absolute inset-0 rounded-3xl border-2 border-amber-400/60 animate-ping opacity-25 pointer-events-none"></div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: MOBILE-FRIENDLY WELCOME & VERSION */}
      <div className="relative z-10 pb-4 sm:pb-8 text-center space-y-1.5 px-4 w-full max-w-sm">
        <div className="space-y-0.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide leading-tight">
            Welcome
          </h2>
          <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium">
            स्वातंत्र्य आणि नफ्याची नवी सुरुवात
          </p>
        </div>

        {/* VERSION & TAP HINT */}
        <div className="text-[9px] sm:text-[10px] text-slate-400/90 font-mono pt-1">
          <span>Version 2.1.4 • Govt. Agritech Certified</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
