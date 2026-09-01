import express from 'express';
import {
  sendOTP,
  verifyOTP,
  getMe,
  logout,
  validateFarmerUser,
  validateBuyerUser,
  sendFarmerOTP,
  verifyFarmerOTP,
  sendBuyerOTP,
  verifyBuyerOTP,
  registerFarmer,
  registerBuyer,
  firebaseLogin,
  loginAdmin,
} from '../controllers/authController.js';

const router = express.Router();

// ─── PRIMARY UNIFIED MOBILE + OTP AUTH ENDPOINTS ───
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/me', getMe);
router.post('/logout', logout);

// ─── USER PRE-VALIDATION ───
router.post('/farmer/validate', validateFarmerUser);
router.post('/buyer/validate', validateBuyerUser);

// ─── ROLE-SPECIFIC ALIASES ───
router.post('/farmer/send-otp', sendFarmerOTP);
router.post('/farmer/verify-otp', verifyFarmerOTP);
router.post('/farmer/register', registerFarmer);

router.post('/buyer/send-otp', sendBuyerOTP);
router.post('/buyer/verify-otp', verifyBuyerOTP);
router.post('/buyer/register', registerBuyer);

// ─── ADMIN & FIREBASE ───
router.post('/admin/login', loginAdmin);
router.post('/firebase-login', firebaseLogin);

export default router;
