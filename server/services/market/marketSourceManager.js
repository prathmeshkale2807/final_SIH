import { agmarknetSource } from './agmarknetSource.js';
import { nafedSource } from './nafedSource.js';
import { normalizeMarketRecord } from './marketNormalizer.js';
import { marketCacheService } from './marketCacheService.js';

export const marketSourceManager = {
  fetchAndNormalizeAll: async () => {
    const allNormalizedRecords = [];
    const syncTime = new Date().toISOString();

    // 1. Fetch from AGMARKNET
    try {
      marketCacheService.updateSourceStatus('AGMARKNET', { lastAttempt: syncTime });
      const agmarkRes = await agmarknetSource.fetchDailyPrices();
      if (agmarkRes.available && Array.isArray(agmarkRes.records)) {
        const normalized = agmarkRes.records.map((r) => normalizeMarketRecord(r, 'AGMARKNET'));
        allNormalizedRecords.push(...normalized);
        marketCacheService.updateSourceStatus('AGMARKNET', {
          status: agmarkRes.live ? 'LIVE_CONNECTED' : 'OFFICIAL_BENCHMARK_LOADED',
          lastSuccessfulSync: syncTime,
          recordsUpdated: normalized.length,
          error: null,
        });
      }
    } catch (err) {
      marketCacheService.updateSourceStatus('AGMARKNET', {
        status: 'UNAVAILABLE',
        error: err.message,
      });
    }

    // 2. Fetch from NAFED
    try {
      marketCacheService.updateSourceStatus('NAFED', { lastAttempt: syncTime });
      const nafedRes = await nafedSource.fetchDailyPrices();
      if (nafedRes.available && Array.isArray(nafedRes.records)) {
        const normalized = nafedRes.records.map((r) => normalizeMarketRecord(r, 'NAFED'));
        allNormalizedRecords.push(...normalized);
        marketCacheService.updateSourceStatus('NAFED', {
          status: 'OFFICIAL_BENCHMARK_LOADED',
          lastSuccessfulSync: syncTime,
          recordsUpdated: normalized.length,
          error: null,
        });
      } else {
        marketCacheService.updateSourceStatus('NAFED', {
          status: 'UNAVAILABLE',
          error: nafedRes.reason || 'Source unavailable',
        });
      }
    } catch (err) {
      marketCacheService.updateSourceStatus('NAFED', {
        status: 'UNAVAILABLE',
        error: err.message,
      });
    }

    return allNormalizedRecords;
  },
};
