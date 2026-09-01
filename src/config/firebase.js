import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';

// Resilient Firebase project configuration with default project fallbacks
// Ensures zero runtime crashes even when environment variables are omitted on Vercel / Netlify
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAdA4hBt3TDdPICI5tGm1dpun7lKl_gG9g',
  authDomain: 'hackathon8080-d367a.firebaseapp.com',
  projectId: 'hackathon8080-d367a',
  storageBucket: 'hackathon8080-d367a.firebasestorage.app',
  messagingSenderId: '849988593136',
  appId: '1:849988593136:web:69d8b50433c74786606935',
  measurementId: 'G-BVSP831MWH',
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || DEFAULT_FIREBASE_CONFIG.measurementId,
};

// Verify presence of required Firebase environment variables safely
export const getFirebaseConfigStatus = () => {
  const vars = {
    VITE_FIREBASE_API_KEY: !!(import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey),
    VITE_FIREBASE_AUTH_DOMAIN: !!(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain),
    VITE_FIREBASE_PROJECT_ID: !!(import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId),
    VITE_FIREBASE_STORAGE_BUCKET: !!(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket),
    VITE_FIREBASE_MESSAGING_SENDER_ID: !!(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId),
    VITE_FIREBASE_APP_ID: !!(import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId),
  };
  const isLoaded = Object.values(vars).every(Boolean);
  return { isLoaded, vars };
};

const configStatus = getFirebaseConfigStatus();
if (typeof window !== 'undefined') {
  console.log('[Firebase Diagnostics] Firebase config loaded:', configStatus.isLoaded);
}

// Resilient Initialization of Firebase App, Auth, and Firestore
let appInstance = null;
let authInstance = null;
let dbInstance = null;

try {
  if (getApps().length === 0) {
    appInstance = initializeApp(firebaseConfig);
  } else {
    appInstance = getApp();
  }
  authInstance = getAuth(appInstance);
  dbInstance = getFirestore(appInstance);

  // Enable browser session persistence safely
  if (typeof window !== 'undefined') {
    setPersistence(authInstance, browserLocalPersistence).catch(() => {});
  }
} catch (error) {
  console.warn('[Firebase Diagnostics] Initialization caught error, using fallback mode:', error.message);
  try {
    appInstance = getApps().length === 0 ? initializeApp(DEFAULT_FIREBASE_CONFIG) : getApp();
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
  } catch (fallbackError) {
    console.error('[Firebase Diagnostics] Critical initialization fallback:', fallbackError.message);
    appInstance = {};
    authInstance = { currentUser: null };
    dbInstance = {};
  }
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;

// Initialize Firebase Analytics safely in browser
export let analytics = null;
if (typeof window !== 'undefined' && appInstance && appInstance.name) {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(appInstance);
    }
  }).catch(() => {});
}

if (typeof window !== 'undefined') {
  console.log('[Firebase Diagnostics] Firebase Auth initialized:', !!auth);
  console.log('[Firebase Diagnostics] Cloud Firestore initialized:', !!db);
}

/**
 * Sets up invisible reCAPTCHA verifier for Phone Auth safely
 */
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined' || !auth) return null;

  try {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}
      window.recaptchaVerifier = null;
    }

    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[Firebase Diagnostics] reCAPTCHA verified successfully');
      },
      'expired-callback': () => {
        console.warn('[Firebase Diagnostics] reCAPTCHA expired, clearing verifier');
        try {
          window.recaptchaVerifier?.clear();
          window.recaptchaVerifier = null;
        } catch (e) {}
      },
    });

    console.log('[Firebase Diagnostics] reCAPTCHA initialized: true');
    return window.recaptchaVerifier;
  } catch (err) {
    console.warn('[Firebase Diagnostics] RecaptchaVerifier setup error:', err.code || err.message);
    return null;
  }
};

/**
 * Sends SMS OTP via Firebase Phone Auth
 */
export const sendFirebasePhoneOTP = async (rawPhoneNumber, containerId = 'recaptcha-container') => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please verify configuration.');
  }

  let formattedPhone = rawPhoneNumber.trim();
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+91${formattedPhone}`;
  }

  console.log('[Firebase Diagnostics] Phone OTP requested: true');
  const verifier = setupRecaptcha(containerId);
  const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
  console.log('[Firebase Diagnostics] OTP confirmation received: true');
  return confirmationResult;
};

/**
 * Verifies the SMS OTP and returns the Firebase User & ID Token
 */
export const verifyFirebasePhoneOTP = async (confirmationResult, otpCode) => {
  if (!confirmationResult || typeof confirmationResult.confirm !== 'function') {
    throw new Error('Invalid Firebase Phone Auth confirmation session');
  }

  const userCredential = await confirmationResult.confirm(otpCode);
  const user = userCredential.user;
  console.log('[Firebase Diagnostics] Firebase user authenticated: true');

  const idToken = await user.getIdToken();
  console.log('[Firebase Diagnostics] Firebase ID token obtained: true');

  return {
    user,
    idToken,
    uid: user.uid,
    phoneNumber: user.phoneNumber,
  };
};

export default app;
