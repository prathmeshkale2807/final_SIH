import mongoose from 'mongoose';

const produceSchema = new mongoose.Schema(
  {
    produceId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    farmerId: {
      type: String,
      required: true,
      index: true,
    },
    farmerName: {
      type: String,
      default: 'Farmer',
    },
    crop: {
      type: String,
      required: true,
      index: true,
    },
    variety: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Vegetables',
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'KG',
    },
    quality: {
      type: String,
      default: 'Grade A (Export / Processing Quality)',
    },
    size: {
      type: String,
      default: 'Medium (45mm - 60mm)',
    },
    freshness: {
      type: String,
      default: 'Fresh Harvest (< 48 hrs)',
    },
    harvestDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    expectedPricePerKg: {
      type: Number,
      required: true,
    },
    location: {
      village: { type: String, default: '' },
      taluka: { type: String, default: '' },
      district: { type: String, default: 'Nashik' },
      state: { type: String, default: 'Maharashtra' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'SOLD', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Produce = mongoose.models.Produce || mongoose.model('Produce', produceSchema);
