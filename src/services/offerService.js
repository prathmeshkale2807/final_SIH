import api from './api';

export const offerService = {
  getFarmerOffers: async () => {
    try {
      const res = await api.get('/offers/farmer');
      return res.offers || [];
    } catch (err) {
      console.error('Error fetching farmer offers:', err);
      return [];
    }
  },

  getBuyerOffers: async () => {
    try {
      const res = await api.get('/offers/buyer');
      return res.offers || [];
    } catch (err) {
      console.error('Error fetching buyer offers:', err);
      return [];
    }
  },

  createOffer: async (offerData) => {
    try {
      const res = await api.post('/offers', offerData);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateOfferStatus: async (offerId, status, message = '') => {
    try {
      const res = await api.patch(`/offers/${offerId}`, { status, message });
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  acceptOffer: async (offerId) => {
    return await offerService.updateOfferStatus(offerId, 'ACCEPTED');
  },

  rejectOffer: async (offerId) => {
    return await offerService.updateOfferStatus(offerId, 'REJECTED');
  },

  negotiateOffer: async (offerId, message) => {
    return await offerService.updateOfferStatus(offerId, 'NEGOTIATION', message);
  },
};
