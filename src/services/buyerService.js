import api from './api';

export const buyerService = {
  /**
   * Fetch authenticated buyer's live profile
   */
  getProfile: async () => {
    try {
      const res = await api.get('/buyers/me');
      return res.buyer || res.user || res;
    } catch (err) {
      console.error('Error fetching buyer profile:', err);
      throw err;
    }
  },

  /**
   * Update authenticated buyer's profile
   */
  updateProfile: async (data) => {
    try {
      const res = await api.put('/buyers/me', data);
      return res;
    } catch (err) {
      console.error('Error updating buyer profile:', err);
      throw err;
    }
  },

  getMyRequirements: async () => {
    try {
      const res = await api.get('/buyer/requirements/my');
      return res.requirements || [];
    } catch (err) {
      console.error('Error fetching buyer requirements:', err);
      return [];
    }
  },

  getAllRequirements: async () => {
    try {
      const res = await api.get('/buyer/requirements');
      return res.requirements || [];
    } catch (err) {
      console.error('Error fetching requirements:', err);
      return [];
    }
  },

  createRequirement: async (data) => {
    try {
      const res = await api.post('/buyer/requirements', data);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  getMatchesForRequirement: async (requirementId) => {
    try {
      const res = await api.get(`/matches/buyer/${requirementId}`);
      return res.matches || [];
    } catch (err) {
      console.error('Error fetching matches:', err);
      return [];
    }
  },

  getMatchesForProduce: async (produceId) => {
    try {
      const res = await api.get(`/matches/farmer/${produceId}`);
      return res.matches || [];
    } catch (err) {
      console.error('Error fetching matches:', err);
      return [];
    }
  },

  getAllOffers: async () => {
    try {
      const res = await api.get('/offers/farmer');
      return res.offers || [];
    } catch (err) {
      console.error('Error fetching offers:', err);
      return [];
    }
  },

  acceptOffer: async (id) => {
    try {
      const res = await api.patch(`/offers/${id}`, { status: 'ACCEPTED' });
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};

export default buyerService;
