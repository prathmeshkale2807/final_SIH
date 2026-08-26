import { sendFirebasePhoneOTP, verifyFirebasePhoneOTP } from '../config/firebase';
import { authService } from './authService';

let activeConfirmationResult = null;

export const firebaseAuthService = {
  /**
   * Triggers Firebase Phone SMS OTP after validating mobile
   */
  sendOTP: async (mobile, containerId = 'recaptcha-container') => {
    try {
      const confirmationResult = await sendFirebasePhoneOTP(mobile, containerId);
      activeConfirmationResult = confirmationResult;
      return {
        success: true,
        message: `Firebase SMS OTP sent to +91 ${mobile}`,
        confirmationResult,
      };
    } catch (error) {
      console.error('[Firebase Diagnostics] Phone Auth sendOTP error code:', error.code, 'message:', error.message);
      let userFriendlyMsg = 'Failed to send SMS OTP via Firebase.';

      if (error.code === 'auth/operation-not-allowed') {
        userFriendlyMsg = 'Phone Authentication is not enabled in Firebase Console (Authentication → Sign-in method → Phone → Enable).';
      } else if (error.code === 'auth/invalid-phone-number') {
        userFriendlyMsg = 'The provided phone number is invalid. Please enter a valid 10-digit number.';
      } else if (error.code === 'auth/too-many-requests') {
        userFriendlyMsg = 'Too many requests. Please wait a few minutes or use development mock OTP: 123456.';
      } else if (error.code === 'auth/quota-exceeded') {
        userFriendlyMsg = 'Firebase daily SMS quota exceeded. Configure test phone numbers or upgrade Firebase plan.';
      } else if (error.code === 'auth/captcha-check-failed') {
        userFriendlyMsg = 'reCAPTCHA verification failed or was cancelled. Please refresh and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        userFriendlyMsg = 'Network error connecting to Firebase. Please check your internet connection.';
      } else if (error.code === 'auth/invalid-api-key') {
        userFriendlyMsg = 'Invalid Firebase API Key. Please verify .env.local configuration.';
      }

      return {
        success: false,
        message: userFriendlyMsg,
        code: error.code,
      };
    }
  },

  /**
   * Confirms Firebase SMS OTP, retrieves ID token, and authenticates with Express backend
   */
  verifyOTPAndLogin: async ({ otp, role = 'farmer', farmerId, shopId, mobile, name }) => {
    try {
      if (!activeConfirmationResult) {
        throw new Error('No active SMS session found. Please request a new OTP.');
      }

      const { user, idToken, uid } = await verifyFirebasePhoneOTP(activeConfirmationResult, otp);

      // Authenticate with KRISHAK Express backend using Firebase ID Token
      console.log('[Firebase Diagnostics] Backend token verification: started');
      const backendRes = await authService.firebaseLogin({
        idToken,
        role,
        farmerId,
        shopId,
        mobile: mobile || user.phoneNumber?.replace('+91', ''),
        name,
      });

      console.log('[Firebase Diagnostics] Backend token verification:', backendRes.success);

      if (backendRes.success) {
        activeConfirmationResult = null;
      }

      return backendRes;
    } catch (error) {
      console.error('[Firebase Diagnostics] Phone Auth verify error code:', error.code, 'message:', error.message);
      let userFriendlyMsg = 'Failed to verify OTP.';

      if (error.code === 'auth/invalid-verification-code') {
        userFriendlyMsg = 'Invalid OTP code. Please check your SMS or use test code.';
      } else if (error.code === 'auth/code-expired') {
        userFriendlyMsg = 'The SMS OTP has expired. Please request a new OTP.';
      } else if (error.code === 'auth/session-expired') {
        userFriendlyMsg = 'The SMS verification session has expired. Please request a new OTP.';
      }

      return {
        success: false,
        message: userFriendlyMsg,
        code: error.code,
      };
    }
  },

  getActiveConfirmationResult: () => activeConfirmationResult,
  clearActiveConfirmation: () => {
    activeConfirmationResult = null;
  },
};
