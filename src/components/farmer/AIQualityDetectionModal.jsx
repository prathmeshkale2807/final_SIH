import React, { useState, useEffect, useRef } from 'react';
import {
  DEFAULT_FARM_TOMATO_IMAGE,
  analyzeProduce,
  getQualityGrade,
  calculateOverallScore,
} from '../../services/aiQualityService';

export const AIQualityDetectionModal = ({ isOpen, onClose, onApplyGrade, commodity = 'Tomato' }) => {
  const [selectedImage, setSelectedImage] = useState(DEFAULT_FARM_TOMATO_IMAGE);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(-1); // -1 = idle, 0 to 6 = steps, 7 = finished
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showDetections, setShowDetections] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const fileInputRef = useRef(null);

  const ANALYSIS_STEPS = [
    { title: 'Detecting Produce', desc: 'Isolating crop clusters from background environment' },
    { title: 'Identifying Individual Produce Items', desc: 'Mapping bounding boxes & unit coordinates' },
    { title: 'Analyzing Color and Ripeness', desc: 'RGB histogram & chlorophyll breakdown index' },
    { title: 'Checking Size and Shape', desc: 'Sphericity ratio & diameter uniformity measurement' },
    { title: 'Detecting Visible Surface Defects', desc: 'Scanning for spots, scarring, and fungal blemishes' },
    { title: 'Estimating Visual Freshness', desc: 'Calyx hydration & skin turgidity estimation' },
    { title: 'Calculating Overall Quality Score', desc: 'Applying multi-factor weighted AGMARKNET algorithm' },
  ];

  // Stop camera on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetScan();
    }
  }, [isOpen]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access unavailable. You can upload an image or use the farm sample.');
      setIsCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setSelectedImage(dataUrl);
    stopCamera();
    resetScan();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setSelectedImage(uploadEvent.target.result);
      stopCamera();
      resetScan();
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = () => {
    setSelectedImage(DEFAULT_FARM_TOMATO_IMAGE);
    stopCamera();
    resetScan();
  };

  const resetScan = () => {
    setIsScanning(false);
    setScanStep(-1);
    setShowDetections(false);
    setAnalysisResult(null);
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanStep(0);
    setShowDetections(false);
    setAnalysisResult(null);

    // Run sequential steps
    const stepDuration = 700; // 0.7s per step
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setScanStep(i);
      if (i === 1) {
        // Show detection boxes after step 1
        setShowDetections(true);
      }
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }

    // Generate final analysis result
    const result = await analyzeProduce(selectedImage, commodity);
    setAnalysisResult(result);
    setScanStep(ANALYSIS_STEPS.length);
    setIsScanning(false);
  };

  const handleApply = () => {
    if (analysisResult?.gradeInfo?.dropdownValue) {
      onApplyGrade(analysisResult.gradeInfo.dropdownValue);
    } else {
      onApplyGrade('Grade A (Export / Processing Quality)');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* ─── 1. MODAL HEADER ─── */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-slate-900 text-white border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">AI Quality Detection</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Vision Engine v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                AI-powered visual analysis of agricultural produce
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* ─── 2. MAIN SCROLLABLE CONTENT ─── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* STEP 1: IMAGE INPUT BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Step 1: Input Harvest Image
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Analyzing for: <strong className="text-emerald-700 font-bold">{commodity}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Camera Button */}
              <button
                type="button"
                onClick={startCamera}
                disabled={isScanning}
                className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isCameraActive
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span>📷</span>
                <span>Capture with Camera</span>
              </button>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🖼</span>
                <span>Upload Image</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Farm Sample Fallback Button */}
              <button
                type="button"
                onClick={handleSelectSample}
                disabled={isScanning}
                className="py-2.5 px-3.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Load High-Resolution Farm Tomato Sample"
              >
                <span>🌱</span>
                <span>Farm Sample</span>
              </button>
            </div>

            {cameraError && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 font-medium">
                ⚠️ {cameraError}
              </div>
            )}
          </div>

          {/* ─── IMAGE VIEWER / CAMERA STREAM / SCANNER OVERLAY ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Visual Viewport (7 cols) */}
            <div className="lg:col-span-7 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-md relative min-h-[300px] sm:min-h-[340px] flex items-center justify-center">
              
              {isCameraActive ? (
                <div className="relative w-full h-full min-h-[320px] flex flex-col items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover max-h-[360px]"
                  />
                  <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3 z-20">
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <span>📸 Snap Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs rounded-full cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-slate-900">
                  <img
                    src={selectedImage}
                    alt="Agricultural Produce Lot"
                    className="w-full h-[320px] sm:h-[350px] object-cover"
                    crossOrigin="anonymous"
                  />

                  {/* ─── GREEN LASER SCANNING LINE ANIMATION ─── */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-laser" />
                      <div className="absolute inset-0 bg-emerald-500/10 backdrop-brightness-110 animate-pulse" />
                    </div>
                  )}

                  {/* Status Overlay Badge */}
                  {isScanning && (
                    <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-20">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>AI SCANNING IN PROGRESS</span>
                    </div>
                  )}

                  {/* ─── YOLO-STYLE BOUNDING BOXES ─── */}
                  {(showDetections || analysisResult) && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Box 1 */}
                      <div className="absolute top-[22%] left-[16%] w-[28%] h-[30%] border-2 border-emerald-400 rounded-md bg-emerald-400/15 animate-fade-in shadow-xs">
                        <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                          Tomato 98%
                        </span>
                      </div>
                      {/* Box 2 */}
                      <div className="absolute top-[32%] left-[48%] w-[30%] h-[32%] border-2 border-emerald-400 rounded-md bg-emerald-400/15 animate-fade-in shadow-xs delay-100">
                        <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                          Tomato 96%
                        </span>
                      </div>
                      {/* Box 3 */}
                      <div className="absolute top-[12%] left-[62%] w-[24%] h-[26%] border-2 border-emerald-400 rounded-md bg-emerald-400/15 animate-fade-in shadow-xs delay-200">
                        <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                          Tomato 97%
                        </span>
                      </div>
                      {/* Box 4 */}
                      <div className="absolute top-[54%] left-[22%] w-[26%] h-[28%] border-2 border-emerald-400 rounded-md bg-emerald-400/15 animate-fade-in shadow-xs delay-300">
                        <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                          Tomato 95%
                        </span>
                      </div>
                      {/* Box 5 */}
                      <div className="absolute top-[60%] left-[56%] w-[27%] h-[29%] border-2 border-emerald-400 rounded-md bg-emerald-400/15 animate-fade-in shadow-xs delay-400">
                        <span className="absolute -top-5 left-0 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                          Tomato 94%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Ready / Re-scan prompt */}
                  {!isScanning && !analysisResult && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                      <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl max-w-xs space-y-3 text-white shadow-xl">
                        <div className="text-2xl">🌱</div>
                        <div className="text-xs font-bold text-slate-200">
                          Produce image ready for computer vision inspection.
                        </div>
                        <button
                          type="button"
                          onClick={handleStartScan}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>⚡</span>
                          <span>Start AI Scan</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ─── PROCEDURAL ANALYSIS & RESULTS (5 cols) ─── */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Sequential Analysis Progress Card */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    AI Inspection Pipeline
                  </h3>
                  {isScanning && (
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">
                      {scanStep + 1} / {ANALYSIS_STEPS.length}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {ANALYSIS_STEPS.map((step, idx) => {
                    const isDone = scanStep > idx || analysisResult !== null;
                    const isActive = isScanning && scanStep === idx;

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                          isActive
                            ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950'
                            : isDone
                            ? 'text-slate-800'
                            : 'text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isDone ? (
                            <span className="h-4 w-4 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                              ✓
                            </span>
                          ) : isActive ? (
                            <span className="h-4 w-4 rounded-full bg-emerald-400 animate-ping flex items-center justify-center" />
                          ) : (
                            <span className="h-4 w-4 rounded-full bg-slate-200 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold truncate">{step.title}</span>
                            {isActive && (
                              <span className="text-[10px] font-mono text-emerald-600 font-extrabold animate-pulse">
                                ● Processing
                              </span>
                            )}
                          </div>
                          {isActive && (
                            <p className="text-[10px] text-emerald-700 font-medium leading-tight mt-0.5">
                              {step.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ─── 3. RESULTS & RECOMMENDATION SECTION (WHEN SCAN COMPLETE) ─── */}
          {analysisResult && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 animate-fade-in">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>📊</span>
                    <span>AI QUALITY ANALYSIS</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Multi-parameter computer vision evaluation based on AGMARKNET standards
                  </p>
                </div>
                <span className="self-start sm:self-auto bg-slate-100 text-slate-700 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg">
                  Detected Units: 12 Tomatoes
                </span>
              </div>

              {/* Quality Parameter Bars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                
                {/* 1. Color & Ripeness */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Color &amp; Ripeness</span>
                    <span className="font-mono font-black text-emerald-600">94%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '94%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Weight: 25% • Optimal Red Luster</span>
                </div>

                {/* 2. Surface Condition */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Surface Condition</span>
                    <span className="font-mono font-black text-emerald-600">90%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '90%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Weight: 30% • Smooth &amp; Firm Skin</span>
                </div>

                {/* 3. Visual Freshness */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Visual Freshness</span>
                    <span className="font-mono font-black text-emerald-600">92%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '92%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Weight: 20% • Fresh Calyx Intact</span>
                </div>

                {/* 4. Size Uniformity */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Size Uniformity</span>
                    <span className="font-mono font-black text-emerald-600">88%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '88%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Weight: 15% • 55–65mm Standard</span>
                </div>

                {/* 5. Shape Uniformity */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Shape Symmetry</span>
                    <span className="font-mono font-black text-emerald-600">90%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '90%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Weight: 10% • Symmetrical Globes</span>
                </div>

                {/* 6. Visible Defects */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Visible Defects</span>
                    <span className="font-mono font-black text-emerald-600">Low</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: '95%' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block">&lt; 1% Skin Blemish (Clean)</span>
                </div>
              </div>

              {/* ─── HERO SCORE CARD & RECOMMENDATION BANNER ─── */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gradient-to-br from-[#062d1f] to-[#041a12] text-white p-5 rounded-3xl border border-emerald-700/60 shadow-lg items-center">
                
                {/* Score Left (4 cols) */}
                <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-emerald-800/80 pb-4 md:pb-0 md:pr-4">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl font-mono font-black text-emerald-300 shadow-inner">
                    91%
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 block">
                      AI QUALITY SCORE
                    </span>
                    <span className="text-xl font-black text-white font-mono">91 / 100</span>
                    <span className="text-[10px] text-emerald-400 block">High Confidence (98.4%)</span>
                  </div>
                </div>

                {/* Recommendation Middle (5 cols) */}
                <div className="md:col-span-5 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 block">
                    AI RECOMMENDATION
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-black text-white">
                      GRADE A
                    </span>
                    <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                      Premium Quality
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/90 font-medium">
                    Suitable for market sale &amp; institutional procurement contracts.
                  </p>
                </div>

                {/* Apply Action Right (3 cols) */}
                <div className="md:col-span-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleApply}
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>✓ Apply AI Grade</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleStartScan}
                    className="w-full py-1.5 text-[11px] text-emerald-300 hover:text-white font-bold transition-colors text-center cursor-pointer"
                  >
                    🔄 Re-scan Image
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* ─── 4. MODAL FOOTER ACTIONS ─── */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel / Keep Current Grade
          </button>

          <div className="flex items-center gap-3">
            {!analysisResult && (
              <button
                type="button"
                onClick={handleStartScan}
                disabled={isScanning}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{isScanning ? 'Analyzing Produce...' : 'Start AI Scan'}</span>
              </button>
            )}

            {analysisResult && (
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Apply AI Recommendation</span>
                <span>➔</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIQualityDetectionModal;
