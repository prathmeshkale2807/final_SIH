/**
 * Algorithmic Matching Service
 * Computes rule-based compatibility scores between Farmer Produce and Buyer Requirements.
 */

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === null || lat1 === undefined || lon1 === null || lon1 === undefined ||
      lat2 === null || lat2 === undefined || lon2 === null || lon2 === undefined) {
    return null;
  }
  const R = 6371; // Earth radius in KM
  const dLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
  const dLon = ((Number(lon2) - Number(lon1)) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((Number(lat1) * Math.PI) / 180) *
      Math.cos((Number(lat2) * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function estimateDistanceByDistrict(produceLoc, reqLoc) {
  const pDist = (produceLoc?.district || produceLoc?.city || '').toLowerCase();
  const rDist = (reqLoc?.district || reqLoc?.city || '').toLowerCase();

  if (pDist && rDist && pDist === rDist) {
    return 25; // Same district / cluster
  }

  const nearbyDistricts = {
    pune: ['nashik', 'satara', 'ahmednagar', 'solapur'],
    nashik: ['pune', 'ahmednagar', 'dhule', 'jalgaon'],
    latur: ['solapur', 'osmanabad', 'beed', 'nanded', 'pune'],
    mumbai: ['thane', 'pune', 'raigad', 'nashik'],
  };

  if (pDist && rDist && nearbyDistricts[pDist]?.includes(rDist)) {
    return 95; // Neighboring district
  }

  return 145; // Regional transport distance
}

export const matchingService = {
  calculateHaversineDistance,

  calculateScore: (produce, requirement) => {
    let score = 0;

    // 1. Crop Match Validation
    const pCrop = (produce.crop || '').toLowerCase().trim();
    const rCrop = (requirement.crop || '').toLowerCase().trim();

    const cropMatch = pCrop && rCrop && (pCrop.includes(rCrop) || rCrop.includes(pCrop));
    if (!cropMatch) {
      return null; // Not compatible on crop
    }
    score += 40; // Base score for exact crop match

    // 2. Price Compatibility Check
    const farmerPrice = Number(produce.expectedPricePerKg) || 18;
    const buyerMaxPrice = Number(requirement.maxPricePerKg) || 20;

    if (farmerPrice > buyerMaxPrice * 1.15) {
      return null; // Price exceeds buyer budget by more than 15%
    }

    if (farmerPrice <= buyerMaxPrice) {
      // Extra points for coming under buyer max budget
      const savingsRatio = (buyerMaxPrice - farmerPrice) / buyerMaxPrice;
      score += 25 + Math.min(Math.round(savingsRatio * 15), 10);
    } else {
      // Tight negotiation range
      score += 15;
    }

    // 3. Quality Compatibility
    const pQuality = (produce.quality || '').toLowerCase();
    const rQuality = (requirement.quality || '').toLowerCase();

    if (rQuality.includes('grade a') && pQuality.includes('grade a')) {
      score += 15;
    } else if (!rQuality.includes('grade a') || pQuality.includes('grade b') || pQuality.includes('grade a')) {
      score += 10;
    } else {
      score += 5;
    }

    // 4. Distance Calculation
    const pLat = produce.location?.latitude;
    const pLng = produce.location?.longitude;
    const rLat = requirement.location?.latitude;
    const rLng = requirement.location?.longitude;

    let distanceKm = calculateHaversineDistance(pLat, pLng, rLat, rLng);
    if (distanceKm === null) {
      distanceKm = estimateDistanceByDistrict(produce.location, requirement.location);
    }

    // Proximity Bonus
    if (distanceKm <= 50) {
      score += 10;
    } else if (distanceKm <= 150) {
      score += 7;
    } else {
      score += 3;
    }

    const finalMatchingScore = Math.min(Math.max(score, 60), 98);

    return {
      distanceKm,
      matchingScore: finalMatchingScore,
    };
  },

  matchRequirementWithProduces: (requirement, produces = []) => {
    const activeProduces = produces.filter((p) => (p.status || 'ACTIVE').toUpperCase() === 'ACTIVE');
    const matched = [];

    for (const produce of activeProduces) {
      const matchMetrics = matchingService.calculateScore(produce, requirement);
      if (matchMetrics) {
        matched.push({
          produceId: produce.produceId || produce.id,
          id: produce.produceId || produce.id,
          farmerId: produce.farmerId || 'FARM-2026-MH01',
          farmerName: produce.farmerName || 'Rahul Jadhav',
          farmer: {
            farmerId: produce.farmerId || 'FARM-2026-MH01',
            name: produce.farmerName || 'Rahul Jadhav',
          },
          crop: produce.crop,
          variety: produce.variety || 'Standard Variety',
          quantity: produce.quantity,
          unit: produce.unit || 'KG',
          quality: produce.quality || 'Grade A',
          expectedPricePerKg: produce.expectedPricePerKg,
          location: produce.location || {
            district: produce.district || 'Nashik',
            state: produce.state || 'Maharashtra',
          },
          harvestDate: produce.harvestDate || '',
          distanceKm: matchMetrics.distanceKm,
          matchingScore: matchMetrics.matchingScore,
        });
      }
    }

    return matched.sort((a, b) => b.matchingScore - a.matchingScore);
  },

  matchProduceWithRequirements: (produce, requirements = []) => {
    const openRequirements = requirements.filter((r) => (r.status || 'OPEN').toUpperCase() === 'OPEN');
    const matched = [];

    for (const requirement of openRequirements) {
      const matchMetrics = matchingService.calculateScore(produce, requirement);
      if (matchMetrics) {
        matched.push({
          requirementId: requirement.requirementId || requirement.id,
          id: requirement.requirementId || requirement.id,
          buyerId: requirement.buyerId || 'BUY-2026-PN08',
          buyerName: requirement.buyerName || 'AgroFresh Food Processors Ltd.',
          crop: requirement.crop,
          variety: requirement.variety || 'Standard Variety',
          quantity: requirement.quantity,
          unit: requirement.unit || 'KG',
          quality: requirement.quality || 'Grade A',
          maxPricePerKg: requirement.maxPricePerKg,
          location: requirement.location || {
            city: 'Pune',
            district: 'Pune',
            state: 'Maharashtra',
          },
          distanceKm: matchMetrics.distanceKm,
          matchingScore: matchMetrics.matchingScore,
        });
      }
    }

    return matched.sort((a, b) => b.matchingScore - a.matchingScore);
  },
};
