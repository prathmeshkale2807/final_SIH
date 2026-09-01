import React, { useState, useEffect } from 'react';
import {
  PRODUCE_PROFILES,
  getProduceProfile,
  analyzeProduce,
} from '../../services/aiQualityService';
import { CameraScanner } from './CameraScanner';
import { ProduceImageUploader } from './ProduceImageUploader';
import { ScanOverlay } from './ScanOverlay';
import { AnalysisProgress } from './AnalysisProgress';
import { DetectionOverlay } from './DetectionOverlay';
import { QualityAnalysisResult } from './QualityAnalysisResult';

export const AIQualityDetectionModal = ({
  isOpen,
  onClose,
  onApplyGrade,
  commodity = 'onion',
}) => {
  // Modal view states: 'uploader' | 'camera' | 'scanning' | 'results'
  const [viewState, setViewState] = useState('uploader');
  
  // Photos captured from real camera / uploaded by user
  const [photosList, setPhotosList] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [currentCameraAngle, setCurrentCameraAngle] = useState('front');

  // Target produce filter
  const [selectedCommodity, setSelectedCommodity] = useState(commodity || 'onion');

  // Real Computer Vision Detection States (ZERO MOCK DEFAULTS)
  const [isScanning, setIsScanning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [showDetections, setShowDetections] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentFrameId, setCurrentFrameId] = useState(null);

  // Sync target commodity prop
  useEffect(() => {
    if (commodity) {
      setSelectedCommodity(commodity);
    }
  }, [commodity, isOpen]);

  // Reset states when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      resetScan();
      if (photosList.length === 0) {
        setViewState('camera'); // Open camera immediately for live inspection
      } else {
        setViewState('uploader');
      }
    }
  }, [isOpen]);

  const resetScan = () => {
    setIsScanning(false);
    setPipelineStep(-1);
    setShowDetections(false);
    setAnalysisResult(null);
    setCurrentFrameId(null);
  };

  const handleAddPhoto = (imageSrc, angle = 'front') => {
    setPhotosList((prev) => {
      const next = [...prev, { src: imageSrc, angle }];
      setActivePhotoIndex(next.length - 1);
      return next;
    });
    setViewState('uploader');
    resetScan();
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotosList((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToRemove);
      setActivePhotoIndex(Math.max(0, next.length - 1));
      return next;
    });
    resetScan();
  };

  const handleSelectCommodity = (cropKey) => {
    setSelectedCommodity(cropKey);
    resetScan(); // Invalidate stale results when target changes
  };

  const handleTriggerCamera = (angle = 'front') => {
    setCurrentCameraAngle(angle);
    setViewState('camera');
  };

  const handleCameraCapture = (dataUrl, angle) => {
    handleAddPhoto(dataUrl, angle);
  };

  // ─── REAL COMPUTER VISION PIPELINE EXECUTION ───
  const handleStartScan = async () => {
    if (photosList.length === 0) return;

    resetScan();
    setIsScanning(true);
    setViewState('scanning');
    setPipelineStep(0);

    const frameId = Date.now();
    setCurrentFrameId(frameId);

    const currentImage = photosList[activePhotoIndex]?.src || photosList[0].src;

    // Fast step tracker for visual feedback
    setPipelineStep(1);
    await new Promise((r) => setTimeout(r, 250));
    setPipelineStep(3);

    // Call Real Vision Analyzer with actual frame data
    const result = await analyzeProduce(currentImage, selectedCommodity, frameId);

    setPipelineStep(6);
    await new Promise((r) => setTimeout(r, 200));
    setPipelineStep(8);

    setAnalysisResult(result);
    setShowDetections(Boolean(result.detected && result.count > 0));
    setIsScanning(false);
    setViewState('results');
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

  const currentPhoto = photosList[activePhotoIndex] || photosList[0];
  const profile = getProduceProfile(selectedCommodity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/75 animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* ─── 1. HEADER ─── */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Real AI Quality Detection
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Vision Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Camera-grounded computer vision produce inspection
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

        {/* ─── 2. SCROLLABLE BODY ─── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
          
          {/* CAMERA MODE */}
          {viewState === 'camera' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  📸 Live Viewfinder • Positioning: {currentCameraAngle}
                </span>
                <button
                  type="button"
                  onClick={() => setViewState('uploader')}
                  className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
                >
                  ✕ Exit Camera
                </button>
              </div>
              <CameraScanner
                currentAngle={currentCameraAngle}
                onCapture={handleCameraCapture}
                onCancel={() => setViewState('uploader')}
              />
            </div>
          )}

          {/* MAIN UPLOADER & SCANNER VIEW */}
          {viewState !== 'camera' && (
            <>
              {/* Photo Input Controls */}
              <ProduceImageUploader
                photos={photosList}
                onAddPhoto={handleAddPhoto}
                onRemovePhoto={handleRemovePhoto}
                onSelectCommodity={handleSelectCommodity}
                onTriggerCamera={handleTriggerCamera}
                isScanning={isScanning}
                targetProduceName={selectedCommodity}
              />

              {/* Main Visual Display & Pipeline Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Visual Viewport (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-md relative min-h-[300px] sm:min-h-[360px] flex items-center justify-center">
                  
                  {currentPhoto?.src ? (
                    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-slate-900">
                      <img
                        src={currentPhoto.src}
                        alt="Harvest produce view"
                        className="w-full h-[320px] sm:h-[360px] object-cover"
                        crossOrigin="anonymous"
                      />

                      {/* Computer Vision Frame Overlays */}
                      <ScanOverlay
                        isScanning={isScanning}
                        guidanceText={
                          isScanning
                            ? 'Analyzing current camera frame for target produce...'
                            : analysisResult?.message || 'Frame ready. Click "Analyze Frame" below.'
                        }
                        detectedCount={analysisResult?.count || 0}
                      />

                      {/* REAL BOUNDING BOXES (ZERO FAKE OBJECTS) */}
                      {showDetections && analysisResult && (
                        <DetectionOverlay
                          detections={analysisResult.objects || []}
                          defects={analysisResult.defects || []}
                          showDetections={true}
                          showDefects={true}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                      <div className="text-3xl">📷</div>
                      <p>No camera frame loaded.</p>
                      <button
                        type="button"
                        onClick={() => handleTriggerCamera('front')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer"
                      >
                        Open Camera
                      </button>
                    </div>
                  )}

                </div>

                {/* Pipeline Step Progress Card (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <AnalysisProgress
                    currentStepIndex={pipelineStep}
                    isScanning={isScanning}
                    isCompleted={analysisResult !== null}
                  />

                  {/* Produce Target Filter Info */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Target Produce:</span>
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                        <span>{profile.icon}</span>
                        <span>{profile.name.split(' ')[0]}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Expected Color: {profile.targetColorName}
                    </p>
                  </div>
                </div>

              </div>

              {/* ─── 3. RESULTS DASHBOARD (WHEN ANALYSIS IS COMPLETE) ─── */}
              {viewState === 'results' && analysisResult && (
                <QualityAnalysisResult
                  result={analysisResult}
                  onApplyRecommendation={handleApply}
                  onAddAnotherAngle={(angle) => handleTriggerCamera(angle)}
                  onReset={resetScan}
                />
              )}
            </>
          )}

        </div>

        {/* ─── 4. FOOTER ACTIONS ─── */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel / Keep Current Grade
          </button>

          <div className="flex items-center gap-3">
            {viewState !== 'results' && viewState !== 'camera' && (
              <button
                type="button"
                onClick={handleStartScan}
                disabled={isScanning || photosList.length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>⚡</span>
                <span>{isScanning ? 'Analyzing Frame...' : 'Analyze Frame with Vision AI'}</span>
              </button>
            )}

            {viewState === 'results' && analysisResult?.detected && analysisResult?.count > 0 && (
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Apply AI Recommendation</span>
                <span>➔</span>
              </button>
            )}

            {viewState === 'results' && (!analysisResult?.detected || analysisResult?.count === 0) && (
              <button
                type="button"
                onClick={() => handleTriggerCamera('front')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>📷 Capture New Photo</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIQualityDetectionModal;
