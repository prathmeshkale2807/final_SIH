/**
 * AI Price Prediction Preparation Service
 * Prepared for ML model integration in next phase.
 */

const CROP_PREDICTIONS = {
  onion: {
    cropName: 'Onion (Pyaz / कांदा)',
    currentPrice: 18.4,
    predictedMin: 19.0,
    predictedMax: 22.0,
    predictedAvg: 20.5,
    confidence: 0.78,
    trend: 'RISING',
    recommendation: 'HOLD PRODUCE 1-2 DAYS ⏳',
    factors: [
      { title: 'Recent Price Trend', desc: 'Strong upward momentum across State Mandis (+5.1%)', icon: 'trend' },
      { title: 'Market Arrivals', desc: 'Arrivals decreasing by 8%, limiting supply', icon: 'box' },
      { title: 'Buyer Demand', desc: 'Buyer inquiries and bids increasing by 15%', icon: 'cart' },
      { title: 'Seasonal Pattern', desc: 'Favorable late-Kharif seasonal demand cycle', icon: 'calendar' },
    ],
  },
  tomato: {
    cropName: 'Tomato (Tamatar / टोमॅटो)',
    currentPrice: 24.5,
    predictedMin: 23.0,
    predictedMax: 26.0,
    predictedAvg: 24.8,
    confidence: 0.72,
    trend: 'STABLE',
    recommendation: 'SELL GRADUALLY (SPLIT 50/50) 📦',
    factors: [
      { title: 'Recent Price Trend', desc: 'Moderate upward curve in Pune and Nashik clusters', icon: 'trend' },
      { title: 'Market Arrivals', desc: 'Standard arrivals with moderate local mandi demand', icon: 'box' },
      { title: 'Buyer Demand', desc: 'Food processors actively seeking Grade A batches', icon: 'cart' },
      { title: 'Perishability Risk', desc: 'High perishability suggests 48-hour liquidation cycle', icon: 'calendar' },
    ],
  },
  potato: {
    cropName: 'Potato (Aloo / बटाटा)',
    currentPrice: 16.0,
    predictedMin: 15.5,
    predictedMax: 17.5,
    predictedAvg: 16.5,
    confidence: 0.81,
    trend: 'STABLE',
    recommendation: 'COLD STORAGE / SPLIT APMC SALE 🥔',
    factors: [
      { title: 'Recent Price Trend', desc: 'Prices steady across North and West belt', icon: 'trend' },
      { title: 'Market Arrivals', desc: 'Adequate cold store inventory available', icon: 'box' },
      { title: 'Buyer Demand', desc: 'Consistent retail and chips manufacturer orders', icon: 'cart' },
    ],
  },
  soybean: {
    cropName: 'Soybean (सोयाबीन)',
    currentPrice: 48.5,
    predictedMin: 49.0,
    predictedMax: 52.0,
    predictedAvg: 50.5,
    confidence: 0.84,
    trend: 'RISING',
    recommendation: 'HOLD FOR OIL MILL TENDERS 📈',
    factors: [
      { title: 'Recent Price Trend', desc: 'Export parity supporting domestic spot rates', icon: 'trend' },
      { title: 'Market Arrivals', desc: 'Off-season tightening in Marathwada & Vidarbha', icon: 'box' },
      { title: 'Crush Margin', desc: 'Refined oil realization driving processor bids', icon: 'cart' },
    ],
  },
  wheat: {
    cropName: 'Wheat (Gehun / गहू)',
    currentPrice: 24.6,
    predictedMin: 24.5,
    predictedMax: 26.0,
    predictedAvg: 25.2,
    confidence: 0.86,
    trend: 'RISING',
    recommendation: 'SELL TO ROLLER FLOUR MILLS 🌾',
    factors: [
      { title: 'Recent Price Trend', desc: 'Steady institutional demand above MSP', icon: 'trend' },
      { title: 'Market Arrivals', desc: 'Tapering post-Rabi arrivals', icon: 'box' },
    ],
  },
  cotton: {
    cropName: 'Cotton (Kapas / कापूस)',
    currentPrice: 71.5,
    predictedMin: 72.0,
    predictedMax: 76.0,
    predictedAvg: 74.0,
    confidence: 0.79,
    trend: 'RISING',
    recommendation: 'CONTRACT WITH GINNING MILLS ☁️',
    factors: [
      { title: 'Recent Price Trend', desc: 'Spinning mill restocking phase underway', icon: 'trend' },
      { title: 'Arrivals', desc: 'Tight farm gate supply in central agrarian belt', icon: 'box' },
    ],
  },
};

export const predictionService = {
  getPrediction: (crop = 'onion', district = '', market = '') => {
    const cropKey = (crop || 'onion').toLowerCase();
    const data = CROP_PREDICTIONS[cropKey] || CROP_PREDICTIONS.onion;

    return {
      success: true,
      crop: cropKey,
      district: district || 'Pune',
      market: market || 'Pune APMC',
      currentPrice: data.currentPrice,
      predictedMin: data.predictedMin,
      predictedMax: data.predictedMax,
      predictedAvg: data.predictedAvg,
      confidence: data.confidence,
      trend: data.trend,
      recommendation: data.recommendation,
      factors: data.factors,
    };
  },
};
