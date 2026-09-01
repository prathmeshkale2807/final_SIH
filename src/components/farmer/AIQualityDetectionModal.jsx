import React, { useState, useEffect } from 'react';
import {
  PRODUCE_PROFILES,
  getProduceProfile,
  validateImageQuality,
  analyzeProduce,
  analyzeMultipleImages,
  REALISTIC_FARM_SAMPLES,
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
  commodity = 'Tomato',
}) => {
  // Modal view states: 'uploader' | 'camera' | 'scanning' | 'results' | 'invalid_image'
  const [viewState, setViewState] = useState('uploader');
  
  // Multi-angle photo list: array of { src, angle: 'front' | 'side' | 'closeup' | 'bottom' }
  const [photosList, setPhotosList] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [currentCameraAngle, setCurrentCameraAngle] = useState('front');

  // Selected crop profile
  const [selectedCommodity, setSelectedCommodity] = useState(commodity || 'Tomato');

  // Scanning & Analysis Pipeline states
  const [isScanning, setIsScanning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [showDetections, setShowDetections] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [imageValidationError, setImageValidationError] = useState(null);

  // Sync selectedCommodity when prop changes or modal opens
  useEffect(() => {
    if (commodity) {
      setSelectedCommodity(commodity);
    }
  }, [commodity, isOpen]);

  // Load default farm sample image if empty on open
  useEffect(() => {
    if (isOpen && photosList.length === 0) {
      setPhotosList([
        {
          src: REALISTIC_FARM_SAMPLES[0].url,
          angle: 'front',
        },
      ]);
      setActivePhotoIndex(0);
      setViewState('uploader');
      resetScan();
    }
  }, [isOpen]);

  const resetScan = () => {
    setIsScanning(false);
    setPipelineStep(-1);
    setShowDetections(false);
    setAnalysisResult(null);
    setImageValidationError(null);
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

  const handleSelectSample = (sample) => {
    setSelectedCommodity(sample.crop);
    setPhotosList([
      {
        src: sample.url,
        angle: sample.angle || 'front',
      },
    ]);
    setActivePhotoIndex(0);
    setViewState('uploader');
    resetScan();
  };

  const handleTriggerCamera = (angle = 'front') => {
    setCurrentCameraAngle(angle);
    setViewState('camera');
  };

  const handleCameraCapture = (dataUrl, angle) => {
    handleAddPhoto(dataUrl, angle);
  };

  const handleStartScan = async () => {
    if (photosList.length === 0) return;

    resetScan();
    setIsScanning(true);
    setViewState('scanning');
    setPipelineStep(0);

    const currentImage = photosList[activePhotoIndex]?.src || photosList[0].src;

    // Step 1: Real Image Validation
    const validation = await validateImageQuality(currentImage);
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!validation.isValid) {
      setIsScanning(false);
      setImageValidationError(validation);
      setViewState('invalid_image');
      return;
    }

    // Step 2 to 7: Sequential CV Pipeline Simulation
    const stepDelays = [650, 700, 750, 700, 750, 700, 800];
    for (let i = 1; i <= 7; i++) {
      setPipelineStep(i);
      if (i === 2) {
        setShowDetections(true);
      }
      await new Promise((resolve) => setTimeout(resolve, stepDelays[i - 1] || 600));
    }

    // Run Holistic Multi-Photo Quality Fusion
    const result = await analyzeMultipleImages(photosList, selectedCommodity);
    setAnalysisResult(result);
    setPipelineStep(8);
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
                onSelectSample={handleSelectSample}
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
                            ? 'Scanning color saturation, skin firmness, and blemish density...'
                            : 'Produce photo ready for computer vision inspection'
                        }
                        detectedCount={analysisResult?.detectedCount || 0}
                      />

                      {/* YOLO Detections & Defect Bounding Boxes */}
                      {(showDetections || analysisResult) && (
                        <DetectionOverlay
                          detections={analysisResult?.detections || [
                            { id: 1, label: profile.name.split(' ')[0], confidence: 0.98, boundingBox: { x: 0.16, y: 0.22, width: 0.26, height: 0.28 } },
                            { id: 2, label: profile.name.split(' ')[0], confidence: 0.96, boundingBox: { x: 0.46, y: 0.20, width: 0.28, height: 0.30 } },
                            { id: 3, label: profile.name.split(' ')[0], confidence: 0.97, boundingBox: { x: 0.64, y: 0.26, width: 0.24, height: 0.26 } },
                          ]}
                          defects={analysisResult?.defects || []}
                          showDetections={true}
                          showDefects={true}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No photo loaded. Please capture or upload a produce photo.
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

                  {/* Produce Profile Badge */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Target Commodity Profile:</span>
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                        <span>{profile.icon}</span>
                        <span>{profile.name.split(' ')[0]}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Optimal Color: {profile.targetColorName}
                    </p>
                  </div>
                </div>

              </div>

              {/* ─── 3. INSUFFICIENT PHOTO / BLUR ERROR SCREEN ─── */}
              {viewState === 'invalid_image' && imageValidationError && (
                <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-sm font-black text-amber-950">We Need a Clearer Photo</h3>
                  </div>
                  <p className="text-xs text-amber-900 font-medium leading-relaxed">
                    {imageValidationError.farmerGuidance}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div className={`p-2.5 rounded-xl border font-bold ${imageValidationError.checks.lighting.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-100 border-amber-300 text-amber-900'}`}>
                      {imageValidationError.checks.lighting.message}
                    </div>
                    <div className={`p-2.5 rounded-xl border font-bold ${imageValidationError.checks.sharpness.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-100 border-amber-300 text-amber-900'}`}>
                      {imageValidationError.checks.sharpness.message}
                    </div>
                    <div className={`p-2.5 rounded-xl border font-bold ${imageValidationError.checks.visibility.passed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-100 border-amber-300 text-amber-900'}`}>
                      {imageValidationError.checks.visibility.message}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerCamera('front')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      📷 Take Another Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSample(REALISTIC_FARM_SAMPLES[0])}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      🌱 Use Farm Sample Instead
                    </button>
                  </div>
                </div>
              )}

              {/* ─── 4. RESULTS DASHBOARD (WHEN ANALYSIS IS COMPLETE) ─── */}
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

        {/* ─── 5. FOOTER ACTIONS ─── */}
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
                <span>{isScanning ? 'Analyzing Harvest...' : 'Start AI Scan'}</span>
              </button>
            )}

            {viewState === 'results' && analysisResult && (
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
