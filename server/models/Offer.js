import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    offerId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    produceId: {
      type: String,
      required: true,
      index: true,
    },
    requirementId: {
      type: String,
      default: null,
      index: true,
    },
    buyerId: {
      type: String,
      required: true,
      index: true,
    },
    buyerName: {
      type: String,
      default: 'ABC Food Processors Ltd.',
    },
    buyerTrustScore: {
      type: Number,
      default: 95,
    },
    farmerId: {
      type: String,
      required: true,
      index: true,
    },
    crop: {
      type: String,
      default: 'Onion (Grade A)',
    },
    variety: {
      type: String,
      default: 'Standard Variety',
    },
    offeredPricePerKg: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'KG',
    },
    distance: {
      type: String,
      default: '45 km (Farm Gate Pickup)',
    },
    trust: {
      type: String,
      default: '95/100',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'NEGOTIATION', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index to accelerate active duplicate offer checks
offerSchema.index({ buyerId: 1, produceId: 1, status: 1 });

export const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
