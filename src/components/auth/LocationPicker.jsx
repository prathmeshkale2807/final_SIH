import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LocationPicker = ({ onLocationSelect }) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = {
          lat: pos.coords.latitude.toFixed(4),
          lng: pos.coords.longitude.toFixed(4)
        };
        setCoords(c);
        setStatus('success');
        if (onLocationSelect) onLocationSelect(c);
      },
      (err) => {
        setStatus('error');
        setErrorMsg('Location access denied or unavailable. Please enter manually.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-3">
      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</span>
            <div>
              <div className="text-xs font-bold text-emerald-900">{t('location_captured', 'Location Captured ✓')}</div>
              <div className="text-[11px] text-emerald-700 font-mono">GPS: {coords?.lat}° N, {coords?.lng}° E</div>
            </div>
          </div>
          <button
            type="button"
            onClick={captureLocation}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Re-detect
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={captureLocation}
          disabled={status === 'loading'}
          className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl border border-slate-200 flex items-center justify-center space-x-2 transition-all"
        >
          {status === 'loading' ? (
            <>
              <span className="h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
              <span className="text-xs">Detecting satellite coordinates...</span>
            </>
          ) : (
            <>
              <span className="text-base">📍</span>
              <span className="text-xs">{t('enable_gps', '📍 Enable My Location')}</span>
            </>
          )}
        </button>
      )}

      {status === 'error' && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
          {errorMsg}
        </div>
      )}
    </div>
  );
};
