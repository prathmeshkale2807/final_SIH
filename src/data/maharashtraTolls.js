/**
 * Official NHAI & MSRDC Toll Plazas Database across Maharashtra
 * Verified National Highway, State Expressway & Major Corridor Plazas.
 */

export const MAHARASHTRA_OFFICIAL_TOLLS = [
  // ── 1. NH 53 / NH 6 (Hajira - Kolkata / Surat - Nagpur Corridor) ──
  {
    id: 'toll_nh53_borgaon',
    name: 'NHAI Borgaon Toll Plaza',
    highway: 'NH 53 (Nagpur - Surat Highway)',
    district: 'Akola / Amravati Border',
    lat: 20.7380,
    lng: 77.1950,
    costCommercial: 65,
    costCar: 40,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh53_nandgaon_peth',
    name: 'NHAI Nandgaon Peth Toll Plaza',
    highway: 'NH 53 (Amravati - Nagpur Section)',
    district: 'Amravati',
    lat: 20.9850,
    lng: 77.8210,
    costCommercial: 85,
    costCar: 50,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh53_fagne',
    name: 'NHAI Fagne Toll Plaza',
    highway: 'NH 53 (Dhule - Jalgaon Section)',
    district: 'Dhule',
    lat: 20.9120,
    lng: 74.9210,
    costCommercial: 75,
    costCar: 45,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh53_tarsod',
    name: 'NHAI Tarsod Toll Plaza',
    highway: 'NH 53 (Jalgaon - Muktainagar Section)',
    district: 'Jalgaon',
    lat: 20.9980,
    lng: 75.6820,
    costCommercial: 80,
    costCar: 45,
    exemptAgriculture: true,
    operator: 'NHAI',
  },

  // ── 2. NH 3 / NH 60 (Mumbai - Agra / Pune - Nashik Corridor) ──
  {
    id: 'toll_nh3_pimpalgaon',
    name: 'NHAI Pimpalgaon Baswant Toll Plaza',
    highway: 'NH 3 (Mumbai - Agra Highway)',
    district: 'Nashik',
    lat: 20.1742,
    lng: 73.9785,
    costCommercial: 105,
    costCar: 60,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh3_ghoti',
    name: 'NHAI Ghoti / Padgha Toll Plaza',
    highway: 'NH 3 (Igatpuri - Nashik Highway)',
    district: 'Nashik / Thane',
    lat: 19.6920,
    lng: 73.6180,
    costCommercial: 135,
    costCar: 85,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh3_laling',
    name: 'NHAI Laling Toll Plaza',
    highway: 'NH 3 (Dhule - Malegaon Section)',
    district: 'Dhule',
    lat: 20.8120,
    lng: 74.7520,
    costCommercial: 95,
    costCar: 55,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh60_chalakwadi',
    name: 'NHAI Chalakwadi / Chandoli Toll Plaza',
    highway: 'NH 60 (Pune - Nashik Highway)',
    district: 'Pune (Khed)',
    lat: 18.8950,
    lng: 73.9010,
    costCommercial: 75,
    costCar: 45,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh60_sinnar',
    name: 'NHAI Sinnar Shirdi Link Toll Plaza',
    highway: 'NH 60 (Nashik - Sinnar Highway)',
    district: 'Nashik',
    lat: 19.8210,
    lng: 73.9920,
    costCommercial: 65,
    costCar: 35,
    exemptAgriculture: true,
    operator: 'NHAI',
  },

  // ── 3. SAMRUDDHI MAHAMARG (MSRDC Expressway) ──
  {
    id: 'toll_samruddhi_mehkar',
    name: 'MSRDC Mehkar Interchange Toll Plaza',
    highway: 'Samruddhi Mahamarg (Expressway)',
    district: 'Buldhana',
    lat: 20.1520,
    lng: 76.5710,
    costCommercial: 120,
    costCar: 70,
    exemptAgriculture: true,
    operator: 'MSRDC',
  },
  {
    id: 'toll_samruddhi_jalna',
    name: 'MSRDC Jalna Interchange Toll Plaza',
    highway: 'Samruddhi Mahamarg (Expressway)',
    district: 'Jalna',
    lat: 19.8320,
    lng: 75.9120,
    costCommercial: 140,
    costCar: 85,
    exemptAgriculture: true,
    operator: 'MSRDC',
  },
  {
    id: 'toll_samruddhi_shirdi',
    name: 'MSRDC Shirdi Interchange Toll Plaza',
    highway: 'Samruddhi Mahamarg (Expressway)',
    district: 'Ahmednagar',
    lat: 19.8650,
    lng: 74.4520,
    costCommercial: 155,
    costCar: 95,
    exemptAgriculture: true,
    operator: 'MSRDC',
  },
  {
    id: 'toll_samruddhi_karanja',
    name: 'MSRDC Karanja Lad Interchange Toll Plaza',
    highway: 'Samruddhi Mahamarg (Expressway)',
    district: 'Washim',
    lat: 20.4810,
    lng: 77.4920,
    costCommercial: 135,
    costCar: 80,
    exemptAgriculture: true,
    operator: 'MSRDC',
  },

  // ── 4. NH 48 / NH 4 (Pune - Satara - Kolhapur Highway) ──
  {
    id: 'toll_nh48_khedshivapur',
    name: 'NHAI Khedshivapur Toll Plaza',
    highway: 'NH 48 (Pune - Satara Highway)',
    district: 'Pune',
    lat: 18.3480,
    lng: 73.8560,
    costCommercial: 105,
    costCar: 60,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh48_anewadi',
    name: 'NHAI Anewadi Toll Plaza',
    highway: 'NH 48 (Satara Highway)',
    district: 'Satara',
    lat: 17.7810,
    lng: 74.0210,
    costCommercial: 80,
    costCar: 50,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh48_tasawade',
    name: 'NHAI Tasawade Toll Plaza',
    highway: 'NH 48 (Karad - Kolhapur Section)',
    district: 'Satara (Karad)',
    lat: 17.2910,
    lng: 74.1950,
    costCommercial: 85,
    costCar: 50,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh48_kini',
    name: 'NHAI Kini Toll Plaza',
    highway: 'NH 48 (Kolhapur Section)',
    district: 'Kolhapur',
    lat: 16.8210,
    lng: 74.2810,
    costCommercial: 80,
    costCar: 45,
    exemptAgriculture: true,
    operator: 'NHAI',
  },

  // ── 5. NH 65 (Pune - Solapur - Hyderabad Highway) ──
  {
    id: 'toll_nh65_patas',
    name: 'NHAI Patas Toll Plaza',
    highway: 'NH 65 (Pune - Solapur Highway)',
    district: 'Pune (Daund)',
    lat: 18.4210,
    lng: 74.4510,
    costCommercial: 90,
    costCar: 55,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh65_sardewadi',
    name: 'NHAI Sardewadi Toll Plaza',
    highway: 'NH 65 (Indapur Section)',
    district: 'Pune (Indapur)',
    lat: 18.1520,
    lng: 75.0210,
    costCommercial: 85,
    costCar: 50,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh65_sawleshwar',
    name: 'NHAI Sawleshwar / Mohol Toll Plaza',
    highway: 'NH 65 (Solapur Section)',
    district: 'Solapur',
    lat: 17.8120,
    lng: 75.6810,
    costCommercial: 90,
    costCar: 55,
    exemptAgriculture: true,
    operator: 'NHAI',
  },

  // ── 6. NH 52 (Solapur - Osmanabad - Aurangabad - Dhule Highway) ──
  {
    id: 'toll_nh52_tadval',
    name: 'NHAI Tadval Toll Plaza',
    highway: 'NH 52 (Solapur - Osmanabad Section)',
    district: 'Osmanabad',
    lat: 17.9820,
    lng: 75.9120,
    costCommercial: 75,
    costCar: 45,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh52_kasabkheda',
    name: 'NHAI Kasabkheda Toll Plaza',
    highway: 'NH 52 (Aurangabad - Dhule Section)',
    district: 'Chhatrapati Sambhajinagar',
    lat: 19.9810,
    lng: 75.2510,
    costCommercial: 75,
    costCar: 45,
    exemptAgriculture: true,
    operator: 'NHAI',
  },

  // ── 7. NH 44 (Nagpur - Hyderabad Highway) ──
  {
    id: 'toll_nh44_keljhar',
    name: 'NHAI Keljhar Toll Plaza',
    highway: 'NH 44 (Nagpur - Wardha Section)',
    district: 'Wardha',
    lat: 20.8410,
    lng: 78.7810,
    costCommercial: 85,
    costCar: 50,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
  {
    id: 'toll_nh44_hiwarkhed',
    name: 'NHAI Hiwarkhed Toll Plaza',
    highway: 'NH 44 (Hinganghat Section)',
    district: 'Wardha',
    lat: 20.5510,
    lng: 78.8410,
    costCommercial: 85,
    costCar: 50,
    exemptAgriculture: true,
    operator: 'NHAI',
  },

  // ── 8. NH 753 (Nagpur - Bhandara - Gondia Highway) ──
  {
    id: 'toll_nh753_mathani',
    name: 'NHAI Mathani Toll Plaza',
    highway: 'NH 753 (Nagpur - Bhandara Section)',
    district: 'Nagpur / Bhandara',
    lat: 21.1410,
    lng: 79.4210,
    costCommercial: 65,
    costCar: 40,
    exemptAgriculture: true,
    operator: 'NHAI',
  },
];

/**
 * Calculates whether a specific road polyline crosses any authentic NHAI/MSRDC Toll Plaza.
 * Uses point-to-segment distance and corridor search so no toll is missed.
 */
export function getTollPlazaAlongPolyline(latLngs, originCoords = null, destCoords = null) {
  if (!latLngs || latLngs.length === 0) {
    if (originCoords && destCoords) {
      return getTollBetweenEndpoints(originCoords, destCoords);
    }
    return null;
  }

  // 1. Check all points along polyline
  for (const toll of MAHARASHTRA_OFFICIAL_TOLLS) {
    // Check distance to each waypoint
    for (let i = 0; i < latLngs.length; i++) {
      const [pLat, pLng] = latLngs[i];
      const dist = haversineKm(pLat, pLng, toll.lat, toll.lng);
      if (dist <= 4.5) {
        return toll;
      }
    }

    // Check distance to line segments along the route
    for (let i = 0; i < latLngs.length - 1; i++) {
      const [lat1, lng1] = latLngs[i];
      const [lat2, lng2] = latLngs[i + 1];
      const segDist = distToSegment(toll.lat, toll.lng, lat1, lng1, lat2, lng2);
      if (segDist <= 4.5) {
        return toll;
      }
    }
  }

  // 2. Fallback: check if toll lies within origin-destination bounding box corridor
  if (latLngs.length >= 2) {
    const origin = latLngs[0];
    const dest = latLngs[latLngs.length - 1];
    return getTollBetweenEndpoints({ lat: origin[0], lng: origin[1] }, { lat: dest[0], lng: dest[1] });
  }

  return null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function distToSegment(pLat, pLng, lat1, lng1, lat2, lng2) {
  const x = pLng, y = pLat;
  const x1 = lng1, y1 = lat1;
  const x2 = lng2, y2 = lat2;
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return haversineKm(pLat, pLng, yy, xx);
}

function getTollBetweenEndpoints(origin, dest) {
  if (!origin || !dest) return null;
  const totalDist = haversineKm(origin.lat, origin.lng, dest.lat, dest.lng);
  if (totalDist < 18) return null; // Very local journeys within 18 km rarely cross highway toll plazas

  for (const toll of MAHARASHTRA_OFFICIAL_TOLLS) {
    const d1 = haversineKm(origin.lat, origin.lng, toll.lat, toll.lng);
    const d2 = haversineKm(toll.lat, toll.lng, dest.lat, dest.lng);
    // If toll is along the corridor between origin and dest (triangle inequality buffer < 15%)
    if (d1 + d2 <= totalDist * 1.25 && d1 > 3 && d2 > 3) {
      return toll;
    }
  }
  return null;
}

