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

import { analyzeProduceVision } from '../controllers/aiQualityController.js';

const router = express.Router();

// Real computer vision analysis route
router.post('/analyze-vision', analyzeProduceVision);
router.get('/my', protect, requireRole('farmer'), getMyProduce);
router.post('/', protect, requireRole('farmer'), createProduce);
router.get('/', getAllProduce);
router.get('/:id', getProduceById);
router.put('/:id', protect, requireRole('farmer'), updateProduce);
router.patch('/:id/status', protect, toggleProduceStatus);
router.delete('/:id', protect, requireRole('farmer'), deleteProduce);

export default router;
