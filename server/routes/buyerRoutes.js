import express from 'express';
import { getBuyerProfile, updateBuyerProfile } from '../controllers/buyerController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/buyers/me - Get current authenticated buyer profile
router.get('/me', protect, requireRole('buyer'), getBuyerProfile);

// PUT /api/buyers/me - Update current authenticated buyer profile
router.put('/me', protect, requireRole('buyer'), updateBuyerProfile);

export default router;
