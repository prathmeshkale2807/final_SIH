import api from './api';

const AUTH_STORAGE_KEY = 'krishak_auth_user';
const TOKEN_KEY = 'token';
const ROLE_KEY = 'role';

// Helper to save session in sessionStorage and localStorage
const saveSession = (userObj, token, role) => {
  try {
    const userPayload = { ...userObj, token, role: role || userObj.role };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userPayload));
    sessionStorage.setItem(TOKEN_KEY, token || userObj.token || '');
    sessionStorage.setItem(ROLE_KEY, role || userObj.role || '');

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userPayload));
    localStorage.setItem(TOKEN_KEY, token || userObj.token || '');
    localStorage.setItem(ROLE_KEY, role || userObj.role || '');
  } catch (e) {}
};

const clearSession = () => {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  } catch (e) {}
};

export const authService = {
  /**
   * Pre-validates farmer credentials against backend
   */
  validateFarmer: async (farmerId, mobile) => {
    try {
      return await api.post('/auth/farmer/validate', { farmerId, mobile });
    } catch (err) {
      return { success: false, message: err.message || 'Validation failed' };
    }
  },

  /**
   * Pre-validates buyer credentials against backend
   */
  validateBuyer: async (shopId, mobile) => {
    try {
      return await api.post('/auth/buyer/validate', { shopId, mobile });
    } catch (err) {
      return { success: false, message: err.message || 'Validation failed' };
    }
  },

  /**
   * Send 6-Digit Real SMS OTP to Farmer
   * @param {string} mobileNumber - 10-digit mobile number
   */
  sendFarmerOTP: async (mobileNumber) => {
    const cleanMobile = String(mobileNumber).replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    try {
      const res = await api.post('/auth/send-otp', {
        mobileNumber: cleanMobile,
        role: 'farmer',
      });
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Unable to send OTP. Please try again.',
      };
    }
  },

  /**
   * Send 6-Digit Real SMS OTP to Buyer
   * @param {string} mobileNumber - 10-digit mobile number
   */
  sendBuyerOTP: async (mobileNumber) => {
    const cleanMobile = String(mobileNumber).replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.' };
    }

    try {
      const res = await api.post('/auth/send-otp', {
        mobileNumber: cleanMobile,
        role: 'buyer',
      });
      return res;
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Unable to send OTP. Please try again.',
      };
    }
  },

  /**
   * Verify OTP & Authenticate Farmer
   */
  loginFarmer: async ({ mobile, farmerId, otp, name }) => {
    const cleanMobile = String(mobile || farmerId).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp).trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      return { success: false, message: 'Please enter the 6-digit OTP.' };
    }

    try {
      const res = await api.post('/auth/verify-otp', {
        mobileNumber: cleanMobile,
        otp: cleanOtp,
        role: 'farmer',
        farmerId,
        name,
      });

      if (res.success && res.user) {
        saveSession(res.user, res.token, 'farmer');
      }

      return res;
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Invalid or expired OTP.',
      };
    }
  },

  /**
   * Verify OTP & Authenticate Buyer
   */
  loginBuyer: async ({ mobile, shopId, otp, name }) => {
    const cleanMobile = String(mobile || shopId).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(otp).trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      return { success: false, message: 'Please enter the 6-digit OTP.' };
    }

    try {
      const res = await api.post('/auth/verify-otp', {
        mobileNumber: cleanMobile,
        otp: cleanOtp,
        role: 'buyer',
        shopId,
        name,
      });

      if (res.success && res.user) {
        saveSession(res.user, res.token, 'buyer');
      }

      return res;
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Invalid or expired OTP.',
      };
    }
  },

  /**
   * Admin Password Authentication
   */
  loginAdmin: async ({ username, password }) => {
    try {
      const res = await api.post('/auth/admin/login', { username, password });
      if (res.success && res.user) {
        saveSession(res.user, res.token, 'admin');
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message || 'Invalid admin credentials' };
    }
  },

  /**
   * Register new Farmer
   */
  registerFarmer: async (data) => {
    try {
      const res = await api.post('/auth/farmer/register', data);
      if (res.success && res.user) {
        saveSession(res.user, res.token, 'farmer');
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  },

  /**
   * Register new Buyer
   */
  registerBuyer: async (data) => {
    try {
      const res = await api.post('/auth/buyer/register', data);
      if (res.success && res.user) {
        saveSession(res.user, res.token, 'buyer');
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  },

  /**
   * Fetch active session from /api/auth/me
   */
  fetchCurrentUser: async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        saveSession(res.user, res.user.token || getAuthToken(), res.user.role);
        return res.user;
      }
    } catch (err) {
      // Session invalid or expired
    }
    return null;
  },

  /**
   * Read cached user from storage
   */
  getCurrentUser: () => {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  },

  /**
   * Check if authenticated
   */
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return Boolean(user && (user.farmerId || user.shopId || user.id));
  },

  /**
   * Logout user and clear cookies/storage
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    clearSession();
  },
};

export default authService;
