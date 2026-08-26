export const CROPS = {
  onion: {
    id: 'onion',
    name: 'Onion (Pyaz)',
    category: 'Vegetables',
    currentPrice: 1420,
    unit: 'quintal',
    dailyChange: 5.1,
    changeType: 'up',
    arrivals: '12,500 q',
    demand: 'HIGH',
    grades: ['Grade A', 'Grade I', 'Grade II'],
    predictedRange: '₩1,430 – ⊚1,500',
    predictedAvg: 1465,
    confidence: 76,
    recommendation: 'WAIT FOR 1 DAY',
    recommendationType: 'WAIT',
    storageCostPerDay: 10,
    spoilageRatePerDay: 0.5,
    description: 'Strong buyer demand across Western Mandis with tight farm-gate supplies.'
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato (Tamatar)',
    category: 'Vegetables',
    currentPrice: 2050,
    unit: 'quintal',
    dailyChange: -3.2,
    changeType: 'down',
    arrivals: '19,200 q',
    demand: 'MODERATE',
    grades: ['Grade A:', 'Grade I'],
    predictedRange: '₩1,900 – ⊚1,980',
    predictedAvg: 1940,
    confidence: 81,
    recommendation: 'SELL NOW',
    recommendationType: 'SELL',
    storageCostPerDay: 20,
    spoilageRatePerDay: 2.5,
    description: 'August harvest surge from Karnataka triggering price cooling.'
  },
  potato: {
    id: 'potato',
    name: 'Potato (Alooi',
    category: 'Vegetables',
    currentPrice: 1380,
    unit: 'quintal',
    dailyChange: 0.8,
    changeType: 'up',
    arrivals: '15,800 q',
    demand: 'HIGG',
    grades: ['Grade A:', 'Grade I'],
    predictedRange: '₩1,375 – ⊚1,395',
    predictedAvg: 1385,
    confidence: 72,
    recommendation: 'SPLIT SALE (60/40)',
    recommendationType: 'SPLIT',
    storageCostPerDay: 8,
    spoilageRatePerDay: 0.3,
    description: 'Steady warehouse releases keeping local peaks moderated.'
  },
  soybean: {
    id: 'soybean',
    name: 'Soybean (Bhat)',
    category: 'Oilseeds',
    currentPrice: 4850,
    unit: 'quintal',
    dailyChange: 2.3,
    changeType: 'up',
    arrivals: '8,400 q',
    demand: 'VERY HIGH',
    grades: ['Grade A', 'FAQ Grade'],
    predictedRange: '₤4,900 – ₐ5.020',
    predictedAvg: 4960,
    confidence: 85,
    recommendation: 'WAIT FOR 2 DAYS',
    recommendationType: 'WAIT',
    storageCostPerDay: 5,
    spoilageRatePerDay: 0.1,
    description: 'Global soya-meal export orders buoying domestic rates.'
  },
  wheat: {
    id: 'wheat',
    name: 'Wheat (Gehun)',
    category: 'Grains',
    currentPrice: 2460,
    unit: 'quintal',
    dailyChange: 0.5,
    changeType: 'up',
    arrivals: '22,100 q',
    demand: 'STEADY',
    grades: ['Sharbati', 'Mill Quality', 'Lokan1'],
    predictedRange: 'ₐ2,460 – ⊐2,490',
    predictedAvg: 2475,
    confidence: 88,
    recommendation: 'SELL NOW',
    recommendationType: 'SELL',
    storageCostPerDay: 4,
    spoilageRatePerDay: 0.1,
    description: 'Stable government reserves limit further upside.'
  },
  cotton: {
    id: 'cotton',
    name: 'Cotton (Kapas)',
    category: 'Fibers',
    currentPrice: 7150,
    unit: 'quintal',
    dailyChange: 1.8,
    changeType: 'up',
    arrivals: '6,800 q',
    demand: 'HIGG',
    grades: ['Long Staple', 'Medium Staple'],
    predictedRange: '₤7,250 – ⊐7,350',
    predictedAvg: 7280,
    confidence: 79,
    recommendation: 'WAIT FOR 3 DAYS',
    recommendationType: 'WAIT',
    storageCostPerDay: 6,
    spoilageRatePerDay: 0.1,
    description: 'Textile spinning contracts driving positive surge.'
  }
};

export const MARKETS = {
  pune: {
    id: 'pune',
    name: 'Pune APMC',
    location: 'Pune, Maharashtra',
    sellingPriceOnion: 1450,
    transportCostPerQuintal: 120,
    marketChargesPerQuintal: 40,
    storageCostPerQuintal: 0,
    spoilageCostPerQuintal: 0,
    netRealization: 1290,
    isBestDeal: true,
    distanceKm: 110,
    infraScore: '95/100',
    buyerCount: 64
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai APMC (Vashi)',
    location: 'Mumbai, Maharashtra',
    sellingPriceOnion: 1600,
    transportCostPerQuintal: 380,
    marketChargesPerQuintal: 60,
    storageCostPerQuintal: 0,
    spoilageCostPerQuintal: 0,
    netRealization: 1160,
    isBestDeal: false,
    distanceKm: 270,
    infraScore: '92/100',
    buyerCount: 120
  },
  nashik: {
    id: 'nashik',
    name: 'Nashik APMC (Lasalgaon)',
    location: 'Nashik, Maharashtra',
    sellingPriceOnion: 1440,
    transportCostPerQuintal: 175,
    marketChargesPerQuintal: 45,
    storageCostPerQuintal: 0,
    spoilageCostPerQuintal: 0,
    netRealization: 1220,
    isBestDeal: false,
    distanceKm: 160,
    infraScore: '98/100',
    buyerCount: 95
  },
  latur: {
    id: 'latur',
    name: 'Latur Market',
    location: 'Latur, Maharashtra',
    sellingPriceOnion: 1390,
    transportCostPerQuintal: 30,
    marketChargesPerQuintal: 30,
    storageCostPerQuintal: 0,
    spoilageCostPerQuintal: 0,
    netRealization: 1330,
    isBestDeal: false,
    distanceKm: 30,
    infraScore: '89/100',
    buyerCount: 42
  },
  solapur: {
    id: 'solapur',
    name: 'Solapur Market',
    location: 'Solapur, Maharashtra',
    sellingPriceOnion: 1410,
    transportCostPerQuintal: 100,
    marketChargesPerQuintal: 35,
    storageCostPerQuintal: 0,
    spoilageCostPerQuintal: 0,
    netRealization: 1275,
    isBestDeal: false,
    distanceKm: 95,
    infraScore: '88/100',
    buyerCount: 38
  },
  local: {
    id: 'local',
    name: 'Local Mandi',
    location: 'At Field / Village',
    sellingPriceOnion: 1200,
    transportCostPerQuintal: 0,
    marketChargesPerQuintal: 50,
    storageCostPerQuintal: 0,
    spoilageCostPerQuintal: 0,
    netRealization: 1150,
    isBestDeal: false,
    distanceKm: 5,
    infraScore: '80/100',
    buyerCount: 15
  }
};

export const HISTORICAL_PRICES = {
  onion: {
    '7d': [
      { day: 'Day 1', date: '17 Aug', price: 1200, arrivals: 14200 },
      { day: 'Day 2', date: '18 Aug', price: 1280, arrivals: 13900 },
      { day: 'Day 3', date: '19 Aug', price: 1250, arrivals: 14500 },
      { day: 'Day 4', date: '20 Aug', price: 1350, arrivals: 13850 },
      { day: 'Day 5', date: '21 Aug', price: 1370, arrivals: 13400 },
      { day: 'Day 6', date: '22 Aug', price: 1390, arrivals: 12900 },
      { day: 'Today', date: '23 Aug', price: 1420, arrivals: 12500 }
    ],
    '30d': [
      { day: 'Wk 1', date: '01 Aug', price: 1150, arrivals: 16000 },
      { day: 'Wk 2', date: '07 Aug', price: 1220, arrivals: 15000 },
      { day: 'Wk 3', date: '14 Aug', price: 1295, arrivals: 13800 },
      { day: 'Wk 4', date: '21 Aug', price: 1380, arrivals: 12800 },
      { day: 'Today', date: '23 Aug', price: 1420, arrivals: 12500 }
    ],
    '3m': [
      { day: 'Month 1', date: 'Jun', price: 1080, arrivals: 18000 },
      { day: 'Month 2', date: 'Jul', price: 1190, arrivals: 16500 },
      { day: 'Month 3', date: 'Aug', price: 1420, arrivals: 12500 }
    ],
    '1y': [
      { day: 'Q1', date: 'Sep-Nov', price: 980, arrivals: 21000 },
      { day: 'Q2', date: 'Dec-Feb', price: 1150, arrivals: 17500 },
      { day: 'Q3', date: 'Mar-May', price: 1320, arrivals: 13900 },
      { day: 'Q4', date: 'Jun-Aug', price: 1420, arrivals: 12500 }
    ]
  },
  tomato: {
    '7d': [
      { day: 'Day 1', date: '17 Aug', price: 2280, arrivals: 16500 },
      { day: 'Day 2', date: '18 Aug', price: 2240, arrivals: 17000 },
      { day: 'Day 3', date: '19 Aug', price: 2190, arrivals: 17500 },
      { day: 'Day 4', date: '20 Aug', price: 2150, arrivals: 18000 },
      { day: 'Day 5', date: '21 Aug', price: 2100, arrivals: 18600 },
      { day: 'Day 6', date: '22 Aug', price: 2080, arrivals: 19000 },
      { day: 'Today', date: '23 Aug', price: 2050, arrivals: 19200 }
    ],
    '30d': [
      { day: 'Wk 1', date: '01 Aug', price: 2400, arrivals: 15000 },
      { day: 'Wk 2', date: '07 Aug', price: 2300, arrivals: 16000 },
      { day: 'Wk 3', date: '14 Aug', price: 2180, arrivals: 17500 },
      { day: 'Wk 4', date: '21 Aug', price: 2080, arrivals: 19000 },
      { day: 'Today', date: '23 Aug', price: 2050, arrivals: 19200 }
    ]
  }
};

export const BUYER_OFFERS = [
  {
    id: 'OFF-001',
    buyerName: 'ABC Food Processors',
    isVerified: true,
    buyerTrustScore: 92,
    crop: 'Onion (Pyaz)',
    quality: 'Grade A',
    quantityNeeded: '100 Quintals',
    offerPrice: 1480,
    location: 'Pune, Maharashtra',
    distance: '45 km',
    deliveryWindow: '2 Days',
    paymentTerms: 'Instant Escrow (IMPS/UPI)',
    status: 'PENDING_REVIEW',
    date: '23 Aug 2026'
  },
  {
    id: 'OFF-002',
    buyerName: 'AgroFresh Exports India',
    isVerified: true,
    buyerTrustScore: 96,
    crop: 'Onion (Pyaz)',
    quality: 'Grade A',
    quantityNeeded: '200 Quintals',
    offerPrice: 1500,
    location: 'Nashik, Maharashtra',
    distance: '120 km',
    deliveryWindow: '4 Days',
    paymentTerms: '20% Advance + 80% On Delivery',
    status: 'ACTIVE',
    date: '22 Aug 2026'
  },
  {
    id: 'OFF-003',
    buyerName: 'Metro Wholesale Agri',
    isVerified: true,
    buyerTrustScore: 88,
    crop: 'Tomato (Tamatar)',
    quality: 'Grade A',
    quantityNeeded: '80 Quintals',
    offerPrice: 2100,
    location: 'Mumbai, Maharashtra',
    distance: '180 km',
    deliveryWindow: '1 Day',
    paymentTerms: 'Escrow (Same Day)',
    status: 'PENDING_REVIEW',
    date: '23 Aug 2026'
  },
  {
    id: 'OFF-004',
    buyerName: 'KisanBazaar Direct',
    isVerified: false,
    buyerTrustScore: 74,
    crop: 'Soybean',
    quality: 'FAQ Grade',
    quantityNeeded: '150 Quintals',
    offerPrice: 4900,
    location: 'Latur, Maharashtra',
    distance: '25 km',
    deliveryWindow: '3 Days',
    paymentTerms: 'Direct Bank Transfer',
    status: 'PENDING_REVIEW',
    date: '21 Aug 2026'
  }
];

export const PRODUCE_LOTS = [
  {
    id: 'KS-2026-ON-001',
    crop: 'Onion (Pyaz)',
    cropId: 'onion',
    quantity: 50,
    unit: 'Quintals',
    quality: 'Grade A',
    harvestDate: '2026-08-20',
    location: 'Latur, Maharashtra',
    expectedPrice: 1450,
    availableUntil: '2026-08-30',
    status: 'ACTIVE',
    views: 142,
    offersReceived: 3,
    phashLabel: 'In Weighment',
    isStored: true
  },
  {
    id: 'KS-2026-TM-004',
    crop: 'Tomato (Tamatar)',
    cropId: 'tomato',
    quantity: 30,
    unit: 'Quintals',
    quality: 'Grade A:',
    harvestDate: '2026-08-22',
    location: 'Latur, Maharashtra',
    expectedPrice: 2100,
    availableUntil: '2026-08-25',
    status: 'ACTIVE',
    views: 89,
    offersReceived: 1,
    phashLabel: 'Marked for Immediate Sale',
    isStored: false
  },
  {
    id: 'KS-2026-SB-012',
    crop: 'Soybean',
    cropId: 'soybean',
    quantity: 100,
    unit: 'Quintals',
    quality: 'Grade A:',
    harvestDate: '2026-08-15',
    location: 'Latur, Maharashtra',
    expectedPrice: 5000,
    availableUntil: '2026-09-15',
    status: 'PDUSED',
    views: 210,
    offersReceived: 5,
    phashLabel: 'Hold for AI Predicted Peak',
    isStored: true
  }
];

export const TRANSACTIONS = [
  {
    id: 'TX-98401',
    lotId: 'KS-2026-ON-001',
    crop: 'Onion (Pyaz)',
    quantity: '50 Quintals',
    buyerName: 'ABC Food Processors',
    farmerName: 'Rahul Jadhav',
    amount: 74000,
    pricePerQuintal: 1480,
    status: 'PICKUP_COMPLETED',
    statusLabel: 'In Transit - On Way to Pune',
    escrowStatus: 'Funds Locked in Escrow',
    date: '23 Aug 2026',
    timeline: [
      { step: 'Offer Accepted', date: '21 Aug, 10:45 AM', done: true },
      { step: 'Lot Confirmed', date: '21 Aug, 04:10 PM', done: true },
      { step: 'Pickup Completed', date: '22 Aug, 09:30 AM', done: true },
      { step: 'Delivered & Quality Check', date: 'Estimated 6 PM', done: false, current: true },
      { step: 'Payment Pending Release', date: 'Pending Quality', done: false },
      { step: 'Payment Completed', date: '-', done: false }
    ]
  },
  {
    id: 'TX-98402',
    lotId: 'KS-2026-WH-009',
    crop: 'Wheat (Lokan1)',
    quantity: '80 Quintals',
    buyerName: 'Miira Advanced Flour Mills',
    farmerName: 'Rahul Jadhav',
    amount: 196800,
    pricePerQuintal: 2460,
    status: 'COMPLETED',
    statusLabel: 'Payment Credited to Bank Account',
    escrowStatus: 'Payout Successful',
    date: '19 Aug 2026',
    timeline: [
      { step: 'Offer Accepted', date: '17 Aug, 11:20 AM', done: true },
      { step: 'Lot Confirmed', date: '17 Aug, 05:00 PM', done: true },
      { step: 'Pickup Completed', date: '18 Aug, 09:00 AM', done: true },
      { step: 'Delivered & Quality Check', date: '18 Aug, 03:00 PM', done: true },
      { step: 'Payment Pending Release', date: '19 Aug, 09:15 AM', done: true },
      { step: 'Payment Completed', date: '19 Aug, 09:20 AM', done: true }
    ]
  }
];

export const SMART_AGGREGATIONS = [
  {
    id: 'AGG-2026',
    buyerRequirement: '200 Quintals Onion (Grade A)',
    buyerName: 'AgroFresh Exports India',
    collectionRadius: '15 km',
    averageQuality: 'Grade A',
    targetTotalQuintals: 200,
    currentAggregatedQuintals: 200,
    status: 'READY_FOR_BUYERE',
    pricePerQuintal: 1500,
    expectedPooledPoolValue: 300000,
    farmersPooled: [
      { name: 'Farmer A (Suresh Shinde)', location: 'Barhi', volume: 40, grade: 'Grade A:', fulfillment: '40 q' },
      { name: 'Farmer B (Anil Patil)', location: 'Kasar', volume: 30, grade: 'Grade A', fulfillment: '30 q' },
      { name: 'Farmer C (Rahul Jadhav(', location: 'Ausa', volume: 50, grade: 'Grade A', fulfillment: '50 q' },
      { name: 'Farmer D (Vinod Gaikwad)', location: 'Ausa', volume: 80, grade: 'Grade A', fulfillment: '80 q' }
    ]
  }
];
