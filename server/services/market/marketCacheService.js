/**
 * In-Memory Market Cache & Sync Status Service
 * Ensures instantaneous sub-millisecond query responses and resilient fallback when DB is offline.
 */

let memoryMarketPrices = [];
let sourceStatusAudit = {
  AGMARKNET: {
    status: 'INITIALIZED',
    lastSuccessfulSync: null,
    lastAttempt: null,
    recordsUpdated: 0,
    error: null,
  },
  NAFED: {
    status: 'INITIALIZED',
    lastSuccessfulSync: null,
    lastAttempt: null,
    recordsUpdated: 0,
    error: null,
  },
};

export const marketCacheService = {
  getAll: () => memoryMarketPrices,

  setAll: (records) => {
    memoryMarketPrices = Array.isArray(records) ? records : [];
  },

  upsertRecord: (record) => {
    const idx = memoryMarketPrices.findIndex(
      (m) =>
        m.source === record.source &&
        m.date === record.date &&
        m.marketName === record.marketName &&
        m.commodity === record.commodity &&
        m.variety === record.variety
    );
    if (idx >= 0) {
      memoryMarketPrices[idx] = { ...memoryMarketPrices[idx], ...record, updatedAt: new Date().toISOString() };
    } else {
      memoryMarketPrices.push(record);
    }
  },

  updateSourceStatus: (source, statusData) => {
    if (sourceStatusAudit[source]) {
      sourceStatusAudit[source] = {
        ...sourceStatusAudit[source],
        ...statusData,
      };
    }
  },

  getSourceStatus: () => sourceStatusAudit,
};
