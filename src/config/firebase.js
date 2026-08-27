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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Verify presence of required Firebase environment variables safely
export const getFirebaseConfigStatus = () => {
  const vars = {
    VITE_FIREBASE_API_KEY: !!import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: !!import.meta.env.VITE_FIREBASE_APP_ID,
  };
  const isLoaded = Object.values(vars).every(Boolean);
  return { isLoaded, vars };
};

const configStatus = getFirebaseConfigStatus();
if (typeof window !== 'undefined') {
  console.log('[Firebase Diagnostics] Firebase config loaded:', configStatus.isLoaded);
}

// Initialize Firebase App exactly once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Analytics safely in browser
export let analytics = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

if (typeof window !== 'undefined') {
  console.log('[Firebase Diagnostics] Firebase Auth initialized:', !!auth);
  console.log('[Firebase Diagnostics] Cloud Firestore initialized:', !!db);
}

// Enable browser session persistence
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} catch (e) {}

/**
 * Sets up invisible reCAPTCHA verifier for Phone Auth safely
 */
export const setupRecaptcha = (containerId = 'recaptcha-container') => {
  if (typeof window === 'undefined') return null;

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
