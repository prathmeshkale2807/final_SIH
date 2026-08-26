/**
 * Isolated OTP Service for KRISHAK platform
 * Supports mock development OTP (123456)
 * Ready for future SMS Gateway (e.g. Twilio, Gupshup, Fast2SMS) integration
 */

const activeOTPs = new Map();

export const otpService = {
  sendOTP: async (identifier) => {
    // Generate or use static development OTP
    const otp = '123456';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    activeOTPs.set(identifier, { otp, expiresAt });

    return {
      success: true,
      message: `OTP sent successfully to ${identifier}`,
      demoOTP: '123456',
      countdown: 30,
    };
  },

  verifyOTP: async (identifier, otp) => {
    // Allow development bypass OTP '123456'
    if (otp === '123456') {
      return { success: true, message: 'OTP verified successfully' };
    }

    const record = activeOTPs.get(identifier);
    if (!record) {
      return { success: false, message: 'No OTP requested for this number' };
    }

    if (Date.now() > record.expiresAt) {
      activeOTPs.delete(identifier);
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    if (record.otp !== otp) {
      return { success: false, message: 'Invalid OTP. Please use demo OTP: 123456' };
    }

    activeOTPs.delete(identifier);
    return { success: true, message: 'OTP verified successfully' };
  },
};
