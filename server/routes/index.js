import express from 'express';
import authRoutes from './authRoutes.js';
import farmerRoutes from './farmerRoutes.js';
import buyerRoutes from './buyerRoutes.js';
import produceRoutes from './produceRoutes.js';
import requirementRoutes from './requirementRoutes.js';
import matchingRoutes from './matchingRoutes.js';
import offerRoutes from './offerRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import marketRoutes from './marketRoutes.js';
import predictionRoutes from './predictionRoutes.js';
import profitRoutes from './profitRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'KRISHAK backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular sub-routers
router.use('/auth', authRoutes);
router.use('/farmers', farmerRoutes);
router.use('/buyers', buyerRoutes);
router.use('/produce', produceRoutes);
router.use('/buyer/requirements', requirementRoutes);
router.use('/matches', matchingRoutes);
router.use('/offers', offerRoutes);
router.use('/transactions', transactionRoutes);
router.use('/markets', marketRoutes);
router.use('/predictions', predictionRoutes);
router.use('/profit', profitRoutes);

export default router;
