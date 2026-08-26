import api from './api';

export const transactionService = {
  getFarmerTransactions: async () => {
    try {
      const res = await api.get('/transactions/farmer');
      return res.transactions || [];
    } catch (err) {
      console.error('Error fetching farmer transactions:', err);
      return [];
    }
  },

  getBuyerTransactions: async () => {
    try {
      const res = await api.get('/transactions/buyer');
      return res.transactions || [];
    } catch (err) {
      console.error('Error fetching buyer transactions:', err);
      return [];
    }
  },

  getAll: async () => {
    return await transactionService.getFarmerTransactions();
  },

  getTransactionById: async (id) => {
    try {
      const res = await api.get(`/transactions/${id}`);
      return res.transaction;
    } catch (err) {
      console.error('Error fetching transaction by id:', err);
      return null;
    }
  },

  updateMilestone: async (id, status, extraData = {}) => {
    try {
      const payload = { status, milestoneKey: status, ...extraData };
      const res = await api.patch(`/transactions/${id}/status`, payload);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};

export default transactionService;
