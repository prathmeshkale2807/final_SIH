import express from 'express';
import {
  createOffer,
  getFarmerOffers,
  getBuyerOffers,
  updateOfferStatus,
} from '../controllers/offerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOffer);
router.get('/farmer', protect, getFarmerOffers);
router.get('/buyer', protect, getBuyerOffers);
router.patch('/:id', protect, updateOfferStatus);

export default router;
