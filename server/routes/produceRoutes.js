import express from 'express';
import {
  createProduce,
  getMyProduce,
  getAllProduce,
  getProduceById,
  updateProduce,
  toggleProduceStatus,
  deleteProduce,
} from '../controllers/produceController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific routes before param route
router.get('/my', protect, requireRole('farmer'), getMyProduce);
router.post('/', protect, requireRole('farmer'), createProduce);
router.get('/', getAllProduce);
router.get('/:id', getProduceById);
router.put('/:id', protect, requireRole('farmer'), updateProduce);
router.patch('/:id/status', protect, toggleProduceStatus);
router.delete('/:id', protect, requireRole('farmer'), deleteProduce);

export default router;
