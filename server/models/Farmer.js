import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema(
  {
    farmerId: {
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
    name: {
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
    location: {
      village: { type: String, default: '' },
      taluka: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: 'Maharashtra' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    crops: {
      primaryCrop: { type: String, default: 'Onion' },
      otherCrops: { type: String, default: '' },
    },
    landArea: {
      type: String,
      default: '5',
    },
    role: {
      type: String,
      default: 'farmer',
    },
  },
  { timestamps: true }
);

export const Farmer = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);
