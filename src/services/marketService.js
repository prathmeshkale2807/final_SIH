import api from './api';

export const marketService = {
  /**
   * Fetch market prices with optional filters (crop, district, market)
   * Returns normalized array of markets with authoritative pricePerKg and pricePerQuintal.
   */
  getPrices: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/markets/prices${query ? `?${query}` : ''}`);
      if (res && Array.isArray(res.markets)) {
        return res.markets.map((m) => ({
          ...m,
          id: m.id || `mandi-${m.district || ''}-${m.crop || ''}`,
          marketName: m.marketName || m.name,
          pricePerKg: typeof m.pricePerKg === 'number' ? m.pricePerKg : Number((m.pricePerQuintal / 100).toFixed(2)),
          pricePerQuintal: typeof m.pricePerQuintal === 'number' ? m.pricePerQuintal : Math.round((m.pricePerKg || 0) * 100),
          minPricePerQuintal: m.minPricePerQuintal || m.minPrice || Math.round((m.pricePerKg * 0.85) * 100),
          maxPricePerQuintal: m.maxPricePerQuintal || m.maxPrice || Math.round((m.pricePerKg * 1.15) * 100),
          changePercent: typeof m.changePercent === 'number' ? m.changePercent : parseFloat(m.change || '0'),
          change: m.change || (m.changePercent >= 0 ? `+${m.changePercent}%` : `${m.changePercent}%`),
          changeType: m.changeType || (m.changePercent >= 0 ? 'up' : 'down'),
          arrivalsQuintal: m.arrivalsQuintal || (parseInt(String(m.arrivals).replace(/[^0-9]/g, ''), 10) || 1000),
          arrivals: m.arrivals || `${m.arrivalsQuintal || 1000} Q`,
          status: m.status || 'Active',
          distanceKm: m.distanceKm || 50,
          lastUpdated: m.lastUpdated || new Date().toISOString(),
        }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching market prices:', err);
      throw err;
    }
  },

  /**
   * Fetch historical trend for crop and range (e.g. 7d, 30d)
   */
  getHistory: async (crop = 'onion', range = '7d') => {
    try {
      const res = await api.get(`/markets/history?crop=${encodeURIComponent(crop)}&range=${encodeURIComponent(range)}`);
      return res.history || [];
    } catch (err) {
      console.error('Error fetching price history:', err);
      throw err;
    }
  },

  /**
   * Fetch nearby APMC mandis sorted by distance
   */
  getNearby: async (lat, lng, maxDistance = 150) => {
    try {
      const query = new URLSearchParams({
        ...(lat ? { lat } : {}),
        ...(lng ? { lng } : {}),
        maxDistance,
      }).toString();
      const res = await api.get(`/markets/nearby?${query}`);
      return res.nearbyMandis || [];
    } catch (err) {
      console.error('Error fetching nearby mandis:', err);
      throw err;
    }
  },

  // Backward compatibility helper
  getHistoricalData: async (cropId = 'onion', timeRange = '7d') => {
    return await marketService.getHistory(cropId, timeRange);
  },
};
