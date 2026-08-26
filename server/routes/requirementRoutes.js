import express from 'express';
import {
  createRequirement,
  getMyRequirements,
  getAllRequirements,
  getRequirementById,
  updateRequirement,
  updateRequirementStatus,
} from '../controllers/requirementController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, requireRole('buyer'), getMyRequirements);
router.post('/', protect, requireRole('buyer'), createRequirement);
router.get('/', getAllRequirements);
router.get('/:id', getRequirementById);
router.put('/:id', protect, requireRole('buyer'), updateRequirement);
router.patch('/:id/status', protect, updateRequirementStatus);

export default router;
