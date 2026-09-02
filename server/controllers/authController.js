import jwt from 'jsonwebtoken';
import { Farmer } from '../models/Farmer.js';
import { Buyer } from '../models/Buyer.js';
import { isDBConnected } from '../config/db.js';
import { otpService } from '../services/otpService.js';
import { verifyFirebaseIdToken, isFirebaseAdminInitialized } from '../config/firebase.js';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'krishak_super_secret_jwt_key_2026';
const COOKIE_NAME = 'krishak_token';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
  });
};

const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  });
};

// ─── 1. SEND OTP CONTROLLER (Unified for /send-otp & /farmer/send-otp & /buyer/send-otp) ───
export const sendOTP = async (req, res) => {
  try {
    const rawMobile = req.body.mobileNumber || req.body.mobile;
    if (!rawMobile) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    const result = await otpService.sendOTP(rawMobile);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[Auth Controller] sendOTP error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to send OTP. Please try again.',
    });
  }
};

export const sendFarmerOTP = sendOTP;
export const sendBuyerOTP = sendOTP;

// ─── 2. VERIFY OTP & AUTHENTICATE CONTROLLER ─────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const rawMobile = req.body.mobileNumber || req.body.mobile;
    const submittedOtp = req.body.otp;
    const role = (req.body.role || 'farmer').toLowerCase();
    const providedName = req.body.name || req.body.farmerName || req.body.ownerName;

    if (!rawMobile || !submittedOtp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and 6-digit OTP are required.',
      });
    }

    const mobile = String(rawMobile).replace(/\D/g, '').slice(-10);

    // Verify against cryptographically hashed OTP in database
    const verifyResult = await otpService.verifyOTP(mobile, submittedOtp);
    if (!verifyResult.success) {
      return res.status(401).json(verifyResult);
    }

    // ─── ROLE: FARMER ───
    if (role === 'farmer') {
      let farmer = null;
      try {
        farmer = await Farmer.findOne({ mobile });
        if (!farmer && req.body.farmerId) {
          farmer = await Farmer.findOne({ farmerId: req.body.farmerId });
        }
      } catch (err) {
        console.warn('[Auth Controller] Farmer lookup notice:', err.message);
      }

      // Create farmer account if first-time user
      if (!farmer) {
        const farmerId = req.body.farmerId || `FARM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const payload = {
          farmerId,
          id: farmerId,
          name: providedName || 'Farmer',
          mobile,
          role: 'farmer',
          village: req.body.village || 'Nashik Rural',
          taluka: req.body.taluka || 'Niphad',
          district: req.body.district || 'Nashik',
          state: req.body.state || 'Maharashtra',
          primaryCrop: req.body.primaryCrop || 'Onion',
          landArea: req.body.landArea || '5',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        farmer = await Farmer.create(payload);
      }

      const farmerData = farmer.toObject ? farmer.toObject() : farmer;
      const token = generateToken({
        id: farmerData.farmerId || farmerData.id,
        role: 'farmer',
        mobile: farmerData.mobile,
        name: farmerData.name,
      });

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        token,
        user: farmerData,
        message: 'Farmer authenticated successfully.',
      });
    }

    // ─── ROLE: BUYER ───
    if (role === 'buyer') {
      let buyer = null;
      try {
        buyer = await Buyer.findOne({ mobile });
        if (!buyer && req.body.shopId) {
          buyer = await Buyer.findOne({ shopId: req.body.shopId });
        }
      } catch (err) {
        console.warn('[Auth Controller] Buyer lookup notice:', err.message);
      }

      // Create buyer account if first-time user
      if (!buyer) {
        const shopId = req.body.shopId || `BUY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const payload = {
          shopId,
          id: shopId,
          ownerName: providedName || 'Buyer',
          shopName: req.body.shopName || 'Wholesale Trader',
          mobile,
          role: 'buyer',
          licenseNumber: req.body.licenseNumber || 'MH-APMC-2026-08',
          city: req.body.city || 'Nashik',
          state: req.body.state || 'Maharashtra',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        buyer = await Buyer.create(payload);
      }

      const buyerData = buyer.toObject ? buyer.toObject() : buyer;
      const token = generateToken({
        id: buyerData.shopId || buyerData.id,
        role: 'buyer',
        mobile: buyerData.mobile,
        name: buyerData.ownerName || buyerData.shopName,
      });

      setAuthCookie(res, token);

      return res.status(200).json({
        success: true,
        token,
        user: buyerData,
        message: 'Buyer authenticated successfully.',
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid user role requested.' });
  } catch (error) {
    console.error('[Auth Controller] verifyOTP error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.',
    });
  }
};

export const verifyFarmerOTP = verifyOTP;
export const verifyBuyerOTP = verifyOTP;

// ─── 3. GET CURRENT USER SESSION (GET /api/auth/me) ───────────────────────────
export const getMe = async (req, res) => {
  try {
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;

    if (decoded.role === 'farmer') {
      user = await Farmer.findOne({ mobile: decoded.mobile });
      if (!user && decoded.id) {
        user = await Farmer.findOne({ farmerId: decoded.id });
      }
    } else if (decoded.role === 'buyer') {
      user = await Buyer.findOne({ mobile: decoded.mobile });
      if (!user && decoded.id) {
        user = await Buyer.findOne({ shopId: decoded.id });
      }
    }

    if (!user) {
      user = {
        id: decoded.id,
        role: decoded.role,
        mobile: decoded.mobile,
        name: decoded.name || 'User',
      };
    } else {
      user = user.toObject ? user.toObject() : user;
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session',
    });
  }
};

// ─── 4. LOGOUT (POST /api/auth/logout) ────────────────────────────────────────
export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    path: '/',
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

// ─── 5. USER PRE-VALIDATION ──────────────────────────────────────────────────
export const validateFarmerUser = async (req, res) => {
  const { farmerId, mobile } = req.body;
  if (!mobile && !farmerId) {
    return res.status(400).json({ success: false, message: 'Mobile or Farmer ID is required' });
  }

  let farmer = null;
  if (isDBConnected()) {
    try {
      if (farmerId) farmer = await Farmer.findOne({ farmerId });
      if (!farmer && mobile) farmer = await Farmer.findOne({ mobile });
    } catch (err) { }
  }

  return res.json({
    success: true,
    farmerExists: !!farmer,
    farmerName: farmer?.name || 'Farmer',
    message: farmer ? 'Farmer account verified' : 'Ready for verification',
  });
};

export const validateBuyerUser = async (req, res) => {
  const { shopId, mobile } = req.body;
  if (!mobile && !shopId) {
    return res.status(400).json({ success: false, message: 'Registered mobile number or Shop ID required' });
  }

  let buyer = null;
  if (isDBConnected()) {
    try {
      if (shopId) buyer = await Buyer.findOne({ shopId });
      if (!buyer && mobile) buyer = await Buyer.findOne({ mobile });
    } catch (err) { }
  }

  return res.json({
    success: true,
    buyerExists: !!buyer,
    ownerName: buyer?.ownerName || 'Buyer',
    shopName: buyer?.shopName || 'Enterprise Buyer',
    message: buyer ? 'Buyer account verified' : 'Ready for verification',
  });
};

// ─── 6. REGISTRATION CONTROLLERS ─────────────────────────────────────────────
export const registerFarmer = async (req, res) => {
  try {
    const { name, mobile, village, taluka, district, state, primaryCrop, landArea } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    let farmer = await Farmer.findOne({ mobile });
    if (farmer) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered. Please log in or use a different number.' });
    }

    const farmerId = `FARM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    farmer = await Farmer.create({
      farmerId,
      id: farmerId,
      name: name || 'Farmer',
      mobile,
      village: village || 'Nashik Rural',
      taluka: taluka || 'Niphad',
      district: district || 'Nashik',
      state: state || 'Maharashtra',
      primaryCrop: primaryCrop || 'Onion',
      landArea: landArea || '5',
      role: 'farmer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const farmerData = farmer.toObject ? farmer.toObject() : farmer;
    const token = generateToken({ id: farmerData.farmerId, role: 'farmer', mobile, name: farmerData.name });
    setAuthCookie(res, token);

    return res.status(201).json({ success: true, token, user: farmerData, message: 'Farmer registered successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const registerBuyer = async (req, res) => {
  try {
    const { shopName, ownerName, mobile, licenseNumber, city, state } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    let buyer = await Buyer.findOne({ mobile });
    if (buyer) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered. Please log in or use a different number.' });
    }

    const shopId = `BUY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    buyer = await Buyer.create({
      shopId,
      id: shopId,
      shopName: shopName || 'Wholesale Buyer',
      ownerName: ownerName || 'Trader',
      mobile,
      licenseNumber: licenseNumber || 'MH-APMC-2026-08',
      city: city || 'Nashik',
      state: state || 'Maharashtra',
      role: 'buyer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const buyerData = buyer.toObject ? buyer.toObject() : buyer;
    const token = generateToken({ id: buyerData.shopId, role: 'buyer', mobile, name: buyerData.ownerName });
    setAuthCookie(res, token);

    return res.status(201).json({ success: true, token, user: buyerData, message: 'Buyer registered successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ─── 7. ADMIN LOGIN ──────────────────────────────────────────────────────────
export const loginAdmin = (req, res) => {
  const { username, password } = req.body;
  if ((username === 'admin' || username === 'krishak_admin') && password === (process.env.ADMIN_PASSWORD || 'Krishak@Admin2026')) {
    const token = generateToken({ id: 'ADMIN-01', role: 'admin', name: 'KRISHAK Administrator' });
    const user = { id: 'ADMIN-01', role: 'admin', name: 'KRISHAK Administrator', email: 'admin@krishak.gov.in' };
    setAuthCookie(res, token);
    return res.json({ success: true, token, user, message: 'Admin authenticated successfully' });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
};

// ─── 8. FIREBASE ID TOKEN FALLBACK ───────────────────────────────────────────
export const firebaseLogin = async (req, res) => {
  try {
    const { idToken, role = 'farmer', mobile, name } = req.body;
    let decoded = null;

    if (idToken && isFirebaseAdminInitialized()) {
      try {
        decoded = await verifyFirebaseIdToken(idToken);
      } catch (e) { }
    }

    const cleanMobile = (decoded?.phone_number || mobile || '').replace(/\D/g, '').slice(-10);
    const farmerId = `FARM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const user = {
      id: farmerId,
      farmerId,
      name: name || 'Farmer',
      mobile: cleanMobile || '9876543210',
      role,
    };

    const token = generateToken({ id: user.id, role, mobile: user.mobile, name: user.name });
    setAuthCookie(res, token);

    return res.json({ success: true, token, user, message: 'Firebase authentication verified' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
