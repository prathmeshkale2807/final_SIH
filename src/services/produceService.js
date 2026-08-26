import api from './api';

export const produceService = {
  getMyProduce: async () => {
    try {
      const res = await api.get('/produce/my');
      return res.produces || [];
    } catch (err) {
      console.error('Error fetching farmer produce lots:', err);
      throw err;
    }
  },

  getAllProduce: async () => {
    try {
      const res = await api.get('/produce');
      return res.produces || [];
    } catch (err) {
      console.error('Error fetching all produce:', err);
      throw err;
    }
  },

  getProduceById: async (id) => {
    try {
      const res = await api.get(`/produce/${id}`);
      return res.produce;
    } catch (err) {
      console.error('Error fetching produce by id:', err);
      throw err;
    }
  },

  createProduce: async (produceData) => {
    try {
      const res = await api.post('/produce', produceData);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateProduce: async (id, updateData) => {
    try {
      const res = await api.put(`/produce/${id}`, updateData);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  toggleProduceStatus: async (id, status) => {
    try {
      const res = await api.patch(`/produce/${id}/status`, { status });
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  deleteProduce: async (id) => {
    try {
      const res = await api.delete(`/produce/${id}`);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};

export default produceService;
