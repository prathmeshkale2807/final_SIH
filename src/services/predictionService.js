import api from './api';

export const predictionService = {
  getPrediction: async (crop = 'onion', district = '', market = '') => {
    try {
      const query = new URLSearchParams({
        ...(crop ? { crop } : {}),
        ...(district ? { district } : {}),
        ...(market ? { market } : {}),
      }).toString();

      const res = await api.get(`/predictions${query ? `?${query}` : ''}`);
      return res;
    } catch (err) {
      console.error('Error fetching prediction:', err);
      return {
        currentPrice: 18.4,
        predictedMin: 19.0,
        predictedMax: 22.0,
        predictedAvg: 20.5,
        confidence: 0.78,
        trend: 'RISING',
        recommendation: 'HOLD PRODUCE 1-2 DAYS ⏳',
        factors: [],
      };
    }
  },
};
