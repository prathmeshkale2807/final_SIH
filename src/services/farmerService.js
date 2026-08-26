import api from './api';

export const farmerService = {
  /**
   * Fetch authenticated farmer's profile
   */
  getProfile: async () => {
    try {
      const res = await api.get('/farmers/me');
      return res.farmer || res.user || res;
    } catch (err) {
      console.error('Error fetching farmer profile:', err);
      throw err;
    }
  },

  /**
   * Update farmer profile
   */
  updateProfile: async (data) => {
    try {
      const res = await api.put('/farmers/me', data);
      return res;
    } catch (err) {
      console.error('Error updating farmer profile:', err);
      throw err;
    }
  },
};
