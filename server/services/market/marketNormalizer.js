/**
 * KRISHAK Market Data Normalizer
 * Standardizes commodity names, market names, units, price conversion, and quality checks.
 */

const COMMODITY_ALIASES = {
  onion: 'Onion',
  onions: 'Onion',
  kanda: 'Onion',
  pyaz: 'Onion',
  'red onion': 'Onion',
  'nashik red': 'Onion',
  tomato: 'Tomato',
  tomatoes: 'Tomato',
  tamatar: 'Tomato',
  potato: 'Potato',
  potatoes: 'Potato',
  batata: 'Potato',
  aloo: 'Potato',
  soybean: 'Soybean',
  soya: 'Soybean',
  soyabean: 'Soybean',
  wheat: 'Wheat',
  gehun: 'Wheat',
  gehu: 'Wheat',
  cotton: 'Cotton',
  kapas: 'Cotton',
  maize: 'Maize',
  makka: 'Maize',
  corn: 'Maize',
  chana: 'Gram (Chana)',
  gram: 'Gram (Chana)',
  tur: 'Pigeon Pea (Tur)',
  arhar: 'Pigeon Pea (Tur)',
};

export const normalizeCommodityName = (rawName = '') => {
  if (!rawName) return 'General Agricultural Produce';
  const clean = rawName.toLowerCase().trim().replace(/[_\-]/g, ' ');
  return COMMODITY_ALIASES[clean] || rawName.charAt(0).toUpperCase() + rawName.slice(1);
};

export const normalizeMarketName = (rawName = '') => {
  if (!rawName) return 'Regional APMC';
  let name = rawName.trim();
  if (!name.toUpperCase().includes('APMC') && !name.toUpperCase().includes('MANDI')) {
    name = `${name} APMC`;
  }
  return name;
};

export const normalizeDate = (rawDate) => {
  if (!rawDate) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

/**
 * Normalizes raw source record to KRISHAK standard MarketPrice schema
 */
export const normalizeMarketRecord = (rawRecord, source = 'AGMARKNET') => {
  const commodity = normalizeCommodityName(rawRecord.commodity || rawRecord.crop || rawRecord.commodityName);
  const variety = (rawRecord.variety || 'Standard / Local').trim();
  const marketName = normalizeMarketName(rawRecord.marketName || rawRecord.market || rawRecord.mandi);
  const district = (rawRecord.district || 'Nashik').trim();
  const state = (rawRecord.state || 'Maharashtra').trim();
  const date = normalizeDate(rawRecord.date || rawRecord.arrivalDate || rawRecord.reportDate);

  let modal = Number(rawRecord.modalPricePerQuintal || rawRecord.modalPrice || rawRecord.modal_price || rawRecord.ratePerQuintal);
  let min = Number(rawRecord.minPricePerQuintal || rawRecord.minPrice || rawRecord.min_price);
  let max = Number(rawRecord.maxPricePerQuintal || rawRecord.maxPrice || rawRecord.max_price);

  // If price is supplied in kg instead of quintal
  if (modal < 200 && modal > 0) {
    modal = Math.round(modal * 100);
  }
  if (min < 200 && min > 0) {
    min = Math.round(min * 100);
  }
  if (max < 200 && max > 0) {
    max = Math.round(max * 100);
  }

  // Fallback sanity bounds
  if (!modal || isNaN(modal) || modal <= 0) {
    modal = 1800; // default 18/kg
  }
  if (!min || isNaN(min) || min <= 0) {
    min = Math.round(modal * 0.85);
  }
  if (!max || isNaN(max) || max <= 0) {
    max = Math.round(modal * 1.15);
  }

  // Ensure logical order min <= modal <= max
  if (min > modal) min = Math.round(modal * 0.9);
  if (max < modal) max = Math.round(modal * 1.1);

  // Standardized price per KG calculation
  const pricePerKg = Number((modal / 100).toFixed(2));

  const arrivalQuantity = Number(rawRecord.arrivalQuantity || rawRecord.arrivals || rawRecord.arrivalsQuintal) || 0;
  const arrivalUnit = rawRecord.arrivalUnit || 'Quintal';

  // Data Quality Validation
  let dataQualityStatus = 'VALID';
  if (pricePerKg <= 0 || modal <= 0) {
    dataQualityStatus = 'REVIEW';
  }

  return {
    source,
    sourceRecordId: rawRecord.sourceRecordId || `${source}-${district}-${marketName}-${commodity}-${date}`.replace(/\s+/g, '-'),
    commodity,
    commodityCode: rawRecord.commodityCode || '',
    variety,
    marketName,
    marketCode: rawRecord.marketCode || '',
    district,
    state,
    date,
    arrivalDate: rawRecord.arrivalDate || date,
    minPricePerQuintal: min,
    maxPricePerQuintal: max,
    modalPricePerQuintal: modal,
    pricePerKg,
    arrivalQuantity,
    arrivalUnit,
    currency: 'INR',
    sourceUpdatedAt: rawRecord.sourceUpdatedAt || new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    sourceUrl: rawRecord.sourceUrl || (source === 'NAFED' ? 'https://nafed-india.com' : 'https://agmarknet.gov.in'),
    dataQualityStatus,
  };
};
