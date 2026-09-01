import express from 'express';
import { analyzeProducePipeline, analyzeProduceVision } from '../controllers/aiQualityController.js';

const router = express.Router();

// New 3-stage pipeline endpoint
router.post('/analyze', analyzeProducePipeline);

// Legacy endpoint (backward compatibility)
router.post('/analyze-vision', analyzeProduceVision);

export default router;
