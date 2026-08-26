import express from 'express';
import {
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

// User Pre-validation
router.post('/farmer/validate', validateFarmerUser);
router.post('/buyer/validate', validateBuyerUser);

// Farmer Auth Endpoints
router.post('/farmer/send-otp', sendFarmerOTP);
router.post('/farmer/verify-otp', verifyFarmerOTP);
router.post('/farmer/register', registerFarmer);

// Buyer Auth Endpoints
router.post('/buyer/send-otp', sendBuyerOTP);
router.post('/buyer/verify-otp', verifyBuyerOTP);
router.post('/buyer/register', registerBuyer);

// Admin Auth Endpoints
router.post('/admin/login', loginAdmin);

// Direct Firebase ID Token Auth
router.post('/firebase-login', firebaseLogin);

export default router;
