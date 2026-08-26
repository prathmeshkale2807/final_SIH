import express from 'express';
import {
  getFarmerTransactions,
  getBuyerTransactions,
  getTransactionById,
  updateTransactionStatus,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/farmer', protect, getFarmerTransactions);
router.get('/buyer', protect, getBuyerTransactions);
router.get('/:id', protect, getTransactionById);
router.patch('/:id/status', protect, updateTransactionStatus);

export default router;
