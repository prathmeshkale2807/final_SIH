import express from 'express';
import { getFarmerProfile, updateFarmerProfile } from '../controllers/farmerController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/farmers/me - Authenticated farmer profile
router.get('/me', protect, requireRole('farmer'), getFarmerProfile);

// PUT /api/farmers/me - Update profile
router.put('/me', protect, requireRole('farmer'), updateFarmerProfile);

export default router;
