import express from 'express';
import {
  getMatchesForBuyerRequirement,
  getMatchesForFarmerProduce,
} from '../controllers/matchingController.js';

const router = express.Router();

router.get('/buyer/:requirementId', getMatchesForBuyerRequirement);
router.get('/farmer/:produceId', getMatchesForFarmerProduce);

export default router;
