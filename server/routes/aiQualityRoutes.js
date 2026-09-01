import express from 'express';
import { analyzeProduceVision } from '../controllers/aiQualityController.js';

const router = express.Router();

router.post('/analyze-vision', analyzeProduceVision);

export default router;
