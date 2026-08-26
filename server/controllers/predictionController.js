import { predictionService } from '../services/predictionService.js';

export const getPrediction = async (req, res) => {
  try {
    const { crop = 'onion', district = '', market = '' } = req.query;
    const prediction = predictionService.getPrediction(crop, district, market);
    return res.json(prediction);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
