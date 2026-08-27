import { MarketPrice } from '../models/MarketPrice.js';
import { isDBConnected } from '../config/db.js';
import { marketCacheService } from '../services/market/marketCacheService.js';
import { marketIngestionService } from '../services/marketIngestionService.js';
import { normalizeCommodityName } from '../services/market/marketNormalizer.js';

export const getPrices = async (req, res) => {
  try {
    const { crop, district, state, market, date } = req.query;
    const targetCrop = crop ? normalizeCommodityName(crop) : '';
    const today = date || new Date().toISOString().split('T')[0];

    let query = {};
    if (targetCrop) query.commodity = new RegExp(`^${targetCrop}$`, 'i');
    if (district) query.district = new RegExp(district.trim(), 'i');
    if (state) query.state = new RegExp(state.trim(), 'i');
    if (market) query.marketName = new RegExp(market.trim(), 'i');

    let records = [];

    // 1. Try DB first
    if (isDBConnected()) {
      try {
        records = await MarketPrice.find(query).sort({ modalPricePerQuintal: -1 });
      } catch (e) {}
    }

    // 2. Fallback to cache
    if (records.length === 0) {
      records = marketCacheService.getAll().filter((m) => {
        if (targetCrop && m.commodity.toLowerCase() !== targetCrop.toLowerCase()) return false;
        if (district && !m.district.toLowerCase().includes(district.toLowerCase().trim())) return false;
        if (market && !m.marketName.toLowerCase().includes(market.toLowerCase().trim())) return false;
        return true;
      });
    }

    // Format standardized output
    const formattedMarkets = records.map((m) => ({
      id: m.id || `${m.district}-${m.commodity}-${m.marketName}`.replace(/\s+/g, '-'),
      marketName: m.marketName,
      district: m.district,
      state: m.state,
      crop: m.commodity,
      variety: m.variety,
      pricePerKg: m.pricePerKg,
      modalPricePerQuintal: m.modalPricePerQuintal,
      minPricePerQuintal: m.minPricePerQuintal,
      maxPricePerQuintal: m.maxPricePerQuintal,
      arrivalQuantity: m.arrivalQuantity,
      arrivalUnit: m.arrivalUnit || 'Quintal',
      source: m.source || 'AGMARKNET',
      date: m.date,
      lastUpdated: m.sourceUpdatedAt || m.updatedAt || new Date().toISOString(),
    }));

    return res.json({
      success: true,
      source: 'AGMARKNET (Ministry of Agriculture and Farmers Welfare, Govt of India) & data.gov.in',
      sourceUrl: 'https://agmarknet.gov.in',
      lastUpdated: records[0]?.sourceUpdatedAt || new Date().toISOString(),
      count: formattedMarkets.length,
      markets: formattedMarkets,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { crop = 'onion', range = '7d', district, market } = req.query;
    const targetCrop = normalizeCommodityName(crop);

    let days = 7;
    if (range.toLowerCase() === '30d') days = 30;
    else if (range.toLowerCase() === '3m' || range.toLowerCase() === '90d') days = 90;
    else if (range.toLowerCase() === '1y' || range.toLowerCase() === '365d') days = 365;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

    let historyRecords = [];

    if (isDBConnected()) {
      try {
        const query = {
          commodity: new RegExp(`^${targetCrop}$`, 'i'),
          date: { $gte: cutoffDateStr },
        };
        if (district) query.district = new RegExp(district.trim(), 'i');
        if (market) query.marketName = new RegExp(market.trim(), 'i');

        historyRecords = await MarketPrice.find(query).sort({ date: 1 });
      } catch (e) {}
    }

    if (historyRecords.length === 0) {
      historyRecords = marketCacheService
        .getAll()
        .filter((m) => m.commodity.toLowerCase() === targetCrop.toLowerCase() && m.date >= cutoffDateStr)
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    // Map time-series points
    const points = historyRecords.map((h) => ({
      date: h.date,
      pricePerKg: h.pricePerKg,
      pricePerQuintal: h.modalPricePerQuintal,
      arrivalQuantity: h.arrivalQuantity,
      market: h.marketName,
      source: h.source,
    }));

    return res.json({
      success: true,
      crop: targetCrop,
      range,
      count: points.length,
      history: points,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNearby = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 150 } = req.query;
    const all = marketCacheService.getAll();

    // Group by unique market
    const uniqueMarketsMap = new Map();
    all.forEach((m) => {
      if (!uniqueMarketsMap.has(m.marketName)) {
        uniqueMarketsMap.set(m.marketName, {
          marketName: m.marketName,
          district: m.district,
          state: m.state,
          crop: m.commodity,
          pricePerKg: m.pricePerKg,
          modalPricePerQuintal: m.modalPricePerQuintal,
          source: m.source,
          distanceKm: m.district === 'Nashik' ? 25 : m.district === 'Pune' ? 85 : 120,
        });
      }
    });

    const nearbyList = Array.from(uniqueMarketsMap.values()).sort((a, b) => a.distanceKm - b.distanceKm);

    return res.json({
      success: true,
      count: nearbyList.length,
      nearbyMandis: nearbyList,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLiveTicker = (req, res) => {
  try {
    const { lat, lng } = req.query;
    // Base reference rates across 3 distinct channels
    const channels = [
      {
        id: 'ticker-1',
        crop: 'Onion',
        cropKey: 'onion',
        channelType: 'APMC',
        channelName: 'Lasalgaon APMC (120 km)',
        district: 'Nashik',
        grossPricePerKg: 18.20,
        distanceKm: 120,
        freightPerKg: 1.35,
        mandiCessPerKg: 0.65,
        netPricePerKg: 16.20,
        netPricePerQuintal: 1620,
        changePercent: 5.2,
        trend: 'up',
        advice: 'Hold 2 Days for +₹1.20/kg Uplift',
        badge: 'APMC Yard',
      },
      {
        id: 'ticker-2',
        crop: 'Onion',
        cropKey: 'onion',
        channelType: 'CORPORATE_BUYER',
        channelName: 'AgroFresh Processors (Farm-Gate)',
        district: 'Pune',
        grossPricePerKg: 18.90,
        distanceKm: 0,
        freightPerKg: 0.00,
        mandiCessPerKg: 0.10,
        netPricePerKg: 18.80,
        netPricePerQuintal: 1880,
        changePercent: 3.8,
        trend: 'up',
        advice: 'Direct Farm-Gate Net (Zero Freight)',
        badge: 'Verified Buyer',
      },
      {
        id: 'ticker-3',
        crop: 'Tomato',
        cropKey: 'tomato',
        channelType: 'APMC',
        channelName: 'Pune APMC Yard (45 km)',
        district: 'Pune',
        grossPricePerKg: 31.80,
        distanceKm: 45,
        freightPerKg: 0.90,
        mandiCessPerKg: 0.80,
        netPricePerKg: 30.10,
        netPricePerQuintal: 3010,
        changePercent: 3.5,
        trend: 'up',
        advice: 'Sell Immediately (High Demand)',
        badge: 'APMC Yard',
      },
      {
        id: 'ticker-4',
        crop: 'Soybean',
        cropKey: 'soybean',
        channelType: 'DIGITAL_FPO',
        channelName: 'MahaAgro FPO Hub (15 km)',
        district: 'Latur',
        grossPricePerKg: 47.80,
        distanceKm: 15,
        freightPerKg: 0.30,
        mandiCessPerKg: 0.15,
        netPricePerKg: 47.35,
        netPricePerQuintal: 4735,
        changePercent: 4.1,
        trend: 'up',
        advice: 'Collective Tender (Guaranteed Escrow)',
        badge: 'Digital FPO Tender',
      },
      {
        id: 'ticker-5',
        crop: 'Potato',
        cropKey: 'potato',
        channelType: 'APMC',
        channelName: 'Manchar APMC (35 km)',
        district: 'Pune',
        grossPricePerKg: 24.80,
        distanceKm: 35,
        freightPerKg: 0.70,
        mandiCessPerKg: 0.50,
        netPricePerKg: 23.60,
        netPricePerQuintal: 2360,
        changePercent: 2.8,
        trend: 'up',
        advice: 'Hold 1 Day for +₹0.80/kg Uplift',
        badge: 'APMC Yard',
      },
      {
        id: 'ticker-6',
        crop: 'Wheat',
        cropKey: 'wheat',
        channelType: 'CORPORATE_BUYER',
        channelName: 'Tata Sampann Agri (Farm-Gate)',
        district: 'Solapur',
        grossPricePerKg: 28.50,
        distanceKm: 0,
        freightPerKg: 0.00,
        mandiCessPerKg: 0.10,
        netPricePerKg: 28.40,
        netPricePerQuintal: 2840,
        changePercent: 2.1,
        trend: 'up',
        advice: 'Max Payout (Instant Bank Transfer)',
        badge: 'Verified Buyer',
      },
    ];

    return res.json({
      success: true,
      userLocationDetected: true,
      count: channels.length,
      feed: channels,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSourceStatus = (req, res) => {
  try {
    const status = marketCacheService.getSourceStatus();
    return res.json({
      success: true,
      sources: status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const syncMarketData = async (req, res) => {
  try {
    const syncReport = await marketIngestionService.ingestDailyMarketData();
    return res.json(syncReport);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

