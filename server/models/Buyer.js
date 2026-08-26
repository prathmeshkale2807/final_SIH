import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema(
  {
    shopId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    firebaseUid: {
      type: String,
      default: '',
      index: true,
    },
    shopName: {
      type: String,
      default: '',
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    businessType: {
      type: String,
      default: 'Food Processor',
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: 'Pune' },
      district: { type: String, default: 'Pune' },
      state: { type: String, default: 'Maharashtra' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    productsOfInterest: {
      type: [String],
      default: ['Onion', 'Tomato', 'Soybean'],
    },
    monthlyRequirement: {
      type: Number,
      default: 200,
    },
    trustScore: {
      type: Number,
      default: 95,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: 'buyer',
    },
  },
  { timestamps: true }
);

export const Buyer = mongoose.models.Buyer || mongoose.model('Buyer', buyerSchema);
