import mongoose from 'mongoose';

const buyerRequirementSchema = new mongoose.Schema(
  {
    requirementId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    buyerId: {
      type: String,
      required: true,
      index: true,
    },
    buyerName: {
      type: String,
      default: 'Buyer Enterprise',
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
      default: 'Grade A',
    },
    maxPricePerKg: {
      type: Number,
      required: true,
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: 'Pune' },
      district: { type: String, default: 'Pune' },
      state: { type: String, default: 'Maharashtra' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    requiredBy: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    deliveryPreference: {
      type: String,
      default: 'Farm Gate Pickup by Buyer Truck',
    },
    purchaseType: {
      type: String,
      default: 'Recurring Monthly Order',
    },
    status: {
      type: String,
      enum: ['OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED'],
      default: 'OPEN',
      index: true,
    },
  },
  { timestamps: true }
);

export const BuyerRequirement =
  mongoose.models.BuyerRequirement || mongoose.model('BuyerRequirement', buyerRequirementSchema);
