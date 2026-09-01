import React, { useRef } from 'react';
import { REALISTIC_FARM_SAMPLES } from '../../services/aiQualityService';

export const ProduceImageUploader = ({
  photos = [],
  onAddPhoto,
  onRemovePhoto,
  onSelectSample,
  onTriggerCamera,
  isScanning = false,
  targetProduceName = 'Tomato',
}) => {
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Determine angle label based on current count
        const angle = photos.length === 0 ? 'front' : photos.length === 1 ? 'side' : 'closeup';
        onAddPhoto(e.target.result, angle);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const angleTags = {
    front: { label: 'Top / Front View', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    side: { label: 'Side View', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    closeup: { label: 'Close-up Detail', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    bottom: { label: 'Bottom View', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  };

  return (
    <div className="space-y-4 font-sans">
      
      {/* ─── 1. TOP BAR: CAPTURE & UPLOAD ACTIONS ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
        <div>
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
            Step 1: Input Harvest Photos ({photos.length}/4)
          </span>
          <p className="text-[11px] text-slate-500 font-medium">
            Multi-angle photographs ensure 100% surface &amp; blemish coverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Open Camera Button */}
          <button
            type="button"
            onClick={() => onTriggerCamera(photos.length === 0 ? 'front' : photos.length === 1 ? 'side' : 'closeup')}
            disabled={isScanning || photos.length >= 4}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>📷</span>
            <span>Take Photo</span>
          </button>

          {/* Upload File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning || photos.length >= 4}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>🖼</span>
            <span>Upload Image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      </div>

      {/* ─── 2. PHOTO THUMBNAILS LIST ─── */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((photo, idx) => {
            const tag = angleTags[photo.angle] || angleTags.front;
            return (
              <div
                key={idx}
                className="relative group rounded-2xl overflow-hidden border-2 border-emerald-400/80 bg-slate-900 shadow-sm aspect-video sm:aspect-square flex items-center justify-center"
              >
                <img
                  src={photo.src}
                  alt={`Harvest View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Angle Tag Badge */}
                <div className="absolute top-1.5 left-1.5 pointer-events-none">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border shadow-xs ${tag.color}`}>
                    {tag.label}
                  </span>
                </div>

                {/* Delete Photo Button */}
                {!isScanning && (
                  <button
                    type="button"
                    onClick={() => onRemovePhoto(idx)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shadow-md"
                    title="Remove this photo"
                  >
                    ✕
                  </button>
                )}

                <div className="absolute bottom-1.5 left-1.5 text-[10px] text-white/90 font-mono bg-slate-950/75 px-1.5 py-0.5 rounded">
                  Photo #{idx + 1}
                </div>
              </div>
            );
          })}

          {/* Add Another View Slot */}
          {photos.length < 4 && !isScanning && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer min-h-[110px]"
            >
              <span className="text-2xl text-slate-400 group-hover:text-emerald-600">＋</span>
              <span className="text-[11px] font-bold text-slate-600 mt-1">
                {photos.length === 1 ? '+ Add Side View' : photos.length === 2 ? '+ Add Close-up' : '+ Add Angle'}
              </span>
            </button>
          )}
        </div>
      )}

      {/* ─── 3. DRAG & DROP EMPTY ZONE ─── */}
      {photos.length === 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer space-y-2.5 shadow-2xs"
        >
          <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mx-auto shadow-inner">
            🌱
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Upload Your Harvest Photos
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Drag &amp; drop photos here or click to select from your phone/computer
            </p>
          </div>
        </div>
      )}

      {/* ─── 4. REALISTIC FARM CROPS SAMPLES SELECTOR ─── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
            Test With Realistic Farm Harvest Samples:
          </span>
          <span className="text-[10px] text-slate-400">Direct from field</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {REALISTIC_FARM_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{sample.label.split(' ')[0]}</span>
              <span>{sample.crop}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProduceImageUploader;
