import { createFirestoreModel } from './firestoreAdapter.js';

/**
 * OTP Verification Model
 * Persists OTP verification hashes, timestamps, and attempt counts
 * to guarantee serverless resilience across Vercel function lifecycles.
 */
export const OTPVerification = createFirestoreModel('otp_verifications', {
  primaryKey: 'mobileNumber',
});

export default OTPVerification;
