/**
 * Production-Grade SMS Gateway Adapter for KRISHAK
 * Supports 2Factor, Fast2SMS, MSG91, and Twilio for Indian & Global SMS dispatch.
 * 
 * Configured via server environment variables:
 * - SMS_PROVIDER = '2factor' | 'fast2sms' | 'msg91' | 'twilio'
 * - TWO_FACTOR_API_KEY
 * - FAST2SMS_API_KEY
 * - MSG91_AUTH_KEY, MSG91_TEMPLATE_ID
 * - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 */

export const smsProvider = {
  /**
   * Dispatches a 6-digit SMS OTP to a 10-digit Indian mobile number
   * @param {string} rawMobile - 10-digit mobile number (e.g. '9876543210')
   * @param {string} otp - 6-digit cryptographically generated OTP
   * @returns {Promise<{ success: boolean, provider: string, messageId?: string }>}
   */
  sendOtp: async (rawMobile, otp) => {
    const mobile = String(rawMobile).replace(/\D/g, '').slice(-10);
    const provider = (process.env.SMS_PROVIDER || '').toLowerCase();
    const isProd = process.env.NODE_ENV === 'production';

    // ─── 1. 2FACTOR.IN GATEWAY (Popular Indian DLT SMS Gateway) ───
    const twoFactorKey = process.env.TWO_FACTOR_API_KEY || process.env.SMS_API_KEY;
    if (provider === '2factor' || (twoFactorKey && !provider)) {
      try {
        const template = process.env.TWO_FACTOR_TEMPLATE_NAME || 'OTP1';
        const url = `https://2factor.in/v1/API/V1/${encodeURIComponent(twoFactorKey)}/SMS/${mobile}/${otp}/${encodeURIComponent(template)}`;
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();

        if (data.Status === 'Success') {
          return { success: true, provider: '2factor', messageId: data.Details };
        }
        console.error('[SMS Provider] 2Factor Error:', data.Details);
        throw new Error(data.Details || 'Failed to send OTP via 2Factor');
      } catch (err) {
        console.error('[SMS Provider] 2Factor Request Failed:', err.message);
        if (isProd) throw err;
      }
    }

    // ─── 2. FAST2SMS GATEWAY ───
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (provider === 'fast2sms' || fast2smsKey) {
      try {
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: fast2smsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            variables_values: otp,
            route: 'otp',
            numbers: mobile,
          }),
        });
        const data = await res.json();
        if (data.return === true) {
          return { success: true, provider: 'fast2sms', messageId: data.request_id };
        }
        console.error('[SMS Provider] Fast2SMS Error:', data.message);
        throw new Error(data.message?.[0] || 'Fast2SMS dispatch failed');
      } catch (err) {
        console.error('[SMS Provider] Fast2SMS Request Failed:', err.message);
        if (isProd) throw err;
      }
    }

    // ─── 3. MSG91 GATEWAY ───
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    if (provider === 'msg91' || msg91AuthKey) {
      try {
        const templateId = process.env.MSG91_TEMPLATE_ID || '';
        const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${mobile}&authkey=${msg91AuthKey}&otp=${otp}`;
        const res = await fetch(url, { method: 'POST' });
        const data = await res.json();
        if (data.type === 'success') {
          return { success: true, provider: 'msg91', messageId: data.message };
        }
        console.error('[SMS Provider] MSG91 Error:', data.message);
        throw new Error(data.message || 'MSG91 dispatch failed');
      } catch (err) {
        console.error('[SMS Provider] MSG91 Request Failed:', err.message);
        if (isProd) throw err;
      }
    }

    // ─── 4. TWILIO GATEWAY ───
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
    if (provider === 'twilio' || (twilioSid && twilioToken)) {
      try {
        const authHeader = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
        const params = new URLSearchParams({
          To: `+91${mobile}`,
          From: twilioFrom,
          Body: `Your KRISHAK verification code is ${otp}. Valid for 5 minutes. Do not share with anyone.`,
        });

        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${authHeader}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );
        const data = await res.json();
        if (res.ok) {
          return { success: true, provider: 'twilio', messageId: data.sid };
        }
        console.error('[SMS Provider] Twilio Error:', data.message);
        throw new Error(data.message || 'Twilio dispatch failed');
      } catch (err) {
        console.error('[SMS Provider] Twilio Request Failed:', err.message);
        if (isProd) throw err;
      }
    }

    // ─── 5. STRICT PRODUCTION CHECK ───
    if (isProd) {
      throw new Error(
        'SMS Gateway credentials missing on Vercel. Please set TWO_FACTOR_API_KEY, FAST2SMS_API_KEY, or MSG91_AUTH_KEY in Vercel Environment Variables.'
      );
    }

    // ─── 6. DEVELOPMENT LOGGING ONLY (NODE_ENV !== 'production') ───
    console.log(`[Dev SMS Gateway] Dispatched OTP to +91 ${mobile}: ${otp} (Valid 5 mins)`);
    return {
      success: true,
      provider: 'development-logger',
      messageId: `dev_${Date.now()}`,
    };
  },
};

export default smsProvider;
