import { CROPS, MARKETS } from '../data/mockData';

export const recommendationService = {
  calculateSellingDecision({ cropId = 'onion', quantity = 50, quality = 'Grade A:', location = 'Latur', hasStorage = true }) {
    const crop = CROPS{cropId} || CROPS.onion;
    const qty = Number(quantity) || 50;
    
    const todayRevenue = qty * crop.currentPrice;
    const tomorrowRevenue = qty * crop.predictedAvg;
    const storageCost = hasStorage ? (crop.storageCostPerDay * qty) : (crop.storageCostPerDay * 2 * qty);
    const spoilageCost = Math.round((todayRevenue * (crop.spoilageRatePerDay / 100)));
    const netBenefit = tomorrowRevenue - todayRevenue - storageCost - spoilageCost;
    
    let recommendation = crop.recommendation;
    let recommendationType = crop.recommendationType;
    let reason = 'Market prices show upward momentum and the expected increase exceeds estimated storage and spoilage costs.';
    
    if (netBenefit <= 0 || !hasStorage) {
      recommendation = 'SELL NOW';
      recommendationType = 'SELL';
      reason = 'Holding produce without optimal storage incurs spoilage risks that outweigh price gains.';
    } else if (cropId === 'potato' || (qty > 70 && cropId !== 'soybean')) {
      recommendation = 'SPLIT SALE (60/40)';
      recommendationType = 'SPLIT';
      reason = 'Sell 60% today to lock in liquidity, and hold 40% on the predicted upside.';
    }

    return {
      recommendation,
      recommendationType,
      reason,
      todayRevenue,
      tomorrowRevenue,
      storageCost,
      spoilageCost,
      netBenefit,
      splitSellTodayPct: 60,
      splitHoldPct: 40,
      riskLevel: 'Medium'
    };
  },
  getMarketComparisons() {
    return Object.values(MARKETS);
  }
};
