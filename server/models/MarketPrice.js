import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      enum: ['AGMARKNET', 'NAFED', 'GOV_DATA', 'OFFICIAL_BENCHMARK'],
      default: 'AGMARKNET',
      index: true,
    },
    sourceRecordId: {
      type: String,
      default: '',
      index: true,
    },
    commodity: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    commodityCode: {
      type: String,
      default: '',
    },
    variety: {
      type: String,
      default: 'Standard / Local',
      trim: true,
    },
    marketName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    marketCode: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      default: 'Maharashtra',
      index: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      index: true, // YYYY-MM-DD
    },
    arrivalDate: {
      type: String,
      default: '',
    },
    minPricePerQuintal: {
      type: Number,
      default: 0,
    },
    maxPricePerQuintal: {
      type: Number,
      default: 0,
    },
    modalPricePerQuintal: {
      type: Number,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
      index: true,
    },
    arrivalQuantity: {
      type: Number,
      default: 0,
    },
    arrivalUnit: {
      type: String,
      default: 'Quintal',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    sourceUpdatedAt: {
      type: String,
      default: '',
    },
    fetchedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    sourceUrl: {
      type: String,
      default: 'https://agmarknet.gov.in',
    },
    dataQualityStatus: {
      type: String,
      enum: ['VALID', 'REVIEW', 'ESTIMATED'],
      default: 'VALID',
    },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per source, date, market, commodity, and variety
marketPriceSchema.index(
  { source: 1, date: 1, marketName: 1, commodity: 1, variety: 1 },
  { unique: true }
);

// Additional compound index for fast historical price and arrival lookups
marketPriceSchema.index({ commodity: 1, district: 1, date: -1 });

export const MarketPrice =
  mongoose.models.MarketPrice || mongoose.model('MarketPrice', marketPriceSchema);
