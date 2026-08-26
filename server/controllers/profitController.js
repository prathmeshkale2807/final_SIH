import { profitService } from '../services/profitService.js';
import { Produce } from '../models/Produce.js';

export const analyzeProfit = async (req, res) => {
  try {
    const { produceId, crop, quantity, quality, location } = req.body;

    let payload = {
      crop: crop || 'onion',
      quantity: Number(quantity) || 100,
      quality: quality || 'Grade A',
      location: location || 'Pune',
      produceId: produceId || null,
    };

    if (produceId) {
      try {
        const item = await Produce.findOne({ $or: [{ produceId }, { _id: produceId }] });
        if (item) {
          payload.crop = item.crop || payload.crop;
          payload.quantity = item.quantity || payload.quantity;
          payload.quality = item.quality || payload.quality;
          payload.location = item.location?.district || payload.location;
        }
      } catch (e) {}
    }

    const result = profitService.analyze(payload);
    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
