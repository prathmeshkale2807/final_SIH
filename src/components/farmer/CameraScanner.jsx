import React, { useState, useEffect, useRef } from 'react';
import { ScanOverlay } from './ScanOverlay';

export const CameraScanner = ({ onCapture, onCancel, currentAngle = 'front' }) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (rear) or 'user' (front)
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCameraStream();

    return () => {
      stopCameraStream();
    };
  }, [facingMode]);

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startCameraStream = async () => {
    stopCameraStream();
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera streaming is not supported on this browser.');
      }

      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check if torch/flashlight is supported on the video track
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track?.getCapabilities ? track.getCapabilities() : {};
      setHasTorchSupport(Boolean(capabilities.torch));
    } catch (err) {
      console.warn('Camera stream error:', err);
      let errMsg = 'Camera access unavailable.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errMsg = 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg = 'No camera device found on this system.';
      }
      setError(errMsg);
    }
  };

  const handleToggleTorch = async () => {
    if (!stream || !hasTorchSupport) return;
    const track = stream.getVideoTracks()[0];
    try {
      await track.applyConstraints({
        advanced: [{ torch: !isFlashOn }],
      });
      setIsFlashOn(!isFlashOn);
    } catch (err) {
      console.warn('Failed to toggle torch:', err);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    stopCameraStream();
    onCapture(dataUrl, currentAngle);
  };

  const angleLabels = {
    front: '📸 Top / Front View',
    side: '🔄 Side View',
    closeup: '🔍 Close-up Inspection',
    bottom: '↩ Bottom View',
  };

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] bg-black rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-800 shadow-2xl">
      
      {/* ─── LIVE VIDEO FEED ─── */}
      {!error && (
        <div className="relative w-full h-full flex-1 flex items-center justify-center bg-black overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover min-h-[320px] sm:min-h-[380px]"
          />
          <ScanOverlay
            isScanning={false}
            guidanceText={`Hold steady • Framing: ${angleLabels[currentAngle] || 'Produce Lot'}`}
          />
        </div>
      )}

      {/* ─── CAMERA ERROR / FALLBACK STATE ─── */}
      {error && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white space-y-4 bg-slate-900">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
            📷
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-bold text-slate-100">Camera Stream Unavailable</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <button
              type="button"
              onClick={startCameraStream}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
            >
              🔄 Retry Camera
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              🖼 Upload Image Instead
            </button>
          </div>
        </div>
      )}

      {/* ─── BOTTOM CONTROLS BAR ─── */}
      {!error && (
        <div className="relative z-20 px-6 py-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between gap-3">
          
          {/* Torch / Flashlight Toggle */}
          {hasTorchSupport ? (
            <button
              type="button"
              onClick={handleToggleTorch}
              className={`h-10 w-10 rounded-full flex items-center justify-center text-lg border transition-all cursor-pointer ${
                isFlashOn
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/40'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
              title="Toggle Flashlight"
            >
              💡
            </button>
          ) : (
            <div className="w-10" />
          )}

          {/* Shutter Snap Button */}
          <button
            type="button"
            onClick={handleTakeSnapshot}
            className="h-16 w-16 rounded-full bg-white p-1 shadow-2xl active:scale-95 transition-transform flex items-center justify-center cursor-pointer group"
            title="Take Photo"
          >
            <div className="h-full w-full rounded-full border-4 border-slate-950 bg-emerald-500 group-hover:bg-emerald-400 flex items-center justify-center transition-colors shadow-inner">
              <span className="text-xl">📸</span>
            </div>
          </button>

          {/* Switch Rear / Front Camera */}
          <button
            type="button"
            onClick={handleSwitchCamera}
            className="h-10 w-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-base transition-all cursor-pointer"
            title="Switch Camera (Front/Rear)"
          >
            🔄
          </button>
        </div>
      )}

      {/* Hidden canvas for snapshot rendering */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
