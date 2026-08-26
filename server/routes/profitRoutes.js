import express from 'express';
import { analyzeProfit } from '../controllers/profitController.js';

const router = express.Router();

router.post('/analyze', analyzeProfit);

export default router;
