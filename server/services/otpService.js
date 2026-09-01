import crypto from 'crypto';
import { OTPVerification } from '../models/OTPVerification.js';
import { smsProvider } from './smsProvider.js';

const OTP_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || 'krishak_otp_security_salt_2026';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Creates a cryptographically secure hash of the OTP
 */
const hashOTP = (mobile, otp) => {
  return crypto
    .createHash('sha256')
    .update(`${mobile}:${otp}:${OTP_SECRET}`)
    .digest('hex');
};

export const otpService = {
  /**
   * Generates and sends a real SMS OTP to the provided mobile number
   * @param {string} rawMobile - 10-digit mobile number
   * @returns {Promise<{ success: boolean, message: string, cooldownSeconds?: number }>}
   */
  sendOTP: async (rawMobile) => {
    const mobile = String(rawMobile).replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      throw new Error('Please enter a valid 10-digit Indian mobile number.');
    }

    const now = Date.now();

    // 1. Check for active cooldown in persistent database
    let existingRecord = null;
    try {
      existingRecord = await OTPVerification.findOne({ mobileNumber: mobile });
    } catch (e) {
      console.warn('[OTP Service] DB read notice:', e.message);
    }

    if (existingRecord && existingRecord.lastSentAt) {
      const timeSinceLastSent = now - Number(existingRecord.lastSentAt);
      if (timeSinceLastSent < RESEND_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - timeSinceLastSent) / 1000);
        return {
          success: false,
          cooldown: true,
          remainingSeconds,
          message: `Please wait ${remainingSeconds}s before requesting a new OTP.`,
        };
      }
    }

    // 2. Generate cryptographically secure 6-digit OTP
    const rawOtp = String(crypto.randomInt(100000, 1000000));
    const otpHash = hashOTP(mobile, rawOtp);
    const expiresAt = now + OTP_EXPIRY_MS;

    // 3. Save / Overwrite OTP record in persistent database
    const recordPayload = {
      mobileNumber: mobile,
      id: mobile,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: MAX_VERIFICATION_ATTEMPTS,
      lastSentAt: now,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingRecord && typeof existingRecord.save === 'function') {
      Object.assign(existingRecord, recordPayload);
      await existingRecord.save();
    } else {
      await OTPVerification.create(recordPayload);
    }

    // 4. Dispatch SMS via configured provider (2Factor, Fast2SMS, MSG91, Twilio)
    try {
      await smsProvider.sendOtp(mobile, rawOtp);
    } catch (smsErr) {
      console.error('[OTP Service] SMS Dispatch Failure:', smsErr.message);
      throw new Error(smsErr.message || 'Failed to dispatch SMS OTP. Please check service.');
    }

    return {
      success: true,
      message: `OTP sent successfully to +91 ${mobile}`,
      cooldownSeconds: 60,
    };
  },

  /**
   * Verifies the submitted OTP against the persistent database record
   * @param {string} rawMobile - 10-digit mobile number
   * @param {string} submittedOtp - 6-digit user entered OTP
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  verifyOTP: async (rawMobile, submittedOtp) => {
    const mobile = String(rawMobile).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(submittedOtp).trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      return { success: false, message: 'Please enter a complete 6-digit OTP.' };
    }

    const now = Date.now();
    let record = null;

    try {
      record = await OTPVerification.findOne({ mobileNumber: mobile });
    } catch (e) {
      console.warn('[OTP Service] DB lookup notice:', e.message);
    }

    if (!record) {
      return {
        success: false,
        message: 'No OTP session found for this number. Please request a new OTP.',
      };
    }

    // Check expiry
    if (now > Number(record.expiresAt)) {
      try {
        if (typeof record.remove === 'function') await record.remove();
      } catch (e) {}
      return {
        success: false,
        message: 'OTP has expired (validity 5 minutes). Please request a new OTP.',
      };
    }

    // Check attempt threshold
    const currentAttempts = (record.attempts || 0) + 1;
    if (currentAttempts > (record.maxAttempts || MAX_VERIFICATION_ATTEMPTS)) {
      try {
        if (typeof record.remove === 'function') await record.remove();
      } catch (e) {}
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.',
      };
    }

    // Verify hash
    const expectedHash = hashOTP(mobile, cleanOtp);
    if (record.otpHash !== expectedHash) {
      record.attempts = currentAttempts;
      if (typeof record.save === 'function') {
        await record.save();
      }
      const remainingAttempts = (record.maxAttempts || MAX_VERIFICATION_ATTEMPTS) - currentAttempts;
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
      };
    }

    // Successful Verification -> Remove / Consume OTP Record immediately (Single Use)
    try {
      if (typeof record.remove === 'function') {
        await record.remove();
      } else {
        record.otpHash = null;
        record.expiresAt = 0;
        if (typeof record.save === 'function') await record.save();
      }
    } catch (e) {}

    return {
      success: true,
      message: 'OTP verified successfully.',
    };
  },
};

export default otpService;
