import express from 'express';
import {
  getPrices,
  getHistory,
  getNearby,
  getLiveTicker,
  getSourceStatus,
  syncMarketData,
} from '../controllers/marketController.js';

const router = express.Router();

router.get('/prices', getPrices);
router.get('/history', getHistory);
router.get('/nearby', getNearby);
router.get('/live-ticker', getLiveTicker);
router.get('/source-status', getSourceStatus);
router.post('/sync', syncMarketData);

export default router;
