import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  date: { type: String, default: '' },
  done: { type: Boolean, default: false },
});

const locationSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  district: { type: String, default: '' },
  state: { type: String, default: '' },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
});

const pickupDetailsSchema = new mongoose.Schema({
  scheduledDate: { type: String, default: '' },
  scheduledTime: { type: String, default: '' },
  vehicleNumber: { type: String, default: '' },
  driverPhone: { type: String, default: '' },
  logisticsProvider: { type: String, default: '' },
  notes: { type: String, default: '' },
});

const inspectionDetailsSchema = new mongoose.Schema({
  actualWeight: { type: Number, default: null },
  qualityGrade: { type: String, default: '' },
  notes: { type: String, default: '' },
  inspectedBy: { type: String, default: '' },
  inspectedAt: { type: String, default: '' },
});

const transactionSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    escrowId: {
      type: String,
      default: () => `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    offerId: {
      type: String,
      required: true,
      index: true,
    },
    produceId: {
      type: String,
      default: '',
      index: true,
    },
    farmerId: {
      type: String,
      required: true,
      index: true,
    },
    farmerName: {
      type: String,
      default: 'Rahul Jadhav',
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
    crop: {
      type: String,
      required: true,
    },
    variety: {
      type: String,
      default: 'Standard Variety',
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'KG',
    },
    agreedPricePerKg: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    pickupLocation: {
      type: locationSchema,
      default: () => ({
        address: '',
        district: 'Nashik',
        state: 'Maharashtra',
      }),
    },
    deliveryLocation: {
      type: locationSchema,
      default: () => ({
        address: '',
        district: 'Pune',
        state: 'Maharashtra',
      }),
    },
    pickupDetails: {
      type: pickupDetailsSchema,
      default: () => ({}),
    },
    inspectionDetails: {
      type: inspectionDetailsSchema,
      default: () => ({}),
    },
    pickupCompletedAt: { type: String, default: '' },
    deliveredAt: { type: String, default: '' },
    paymentCompletedAt: { type: String, default: '' },
    escrowStatus: {
      type: String,
      enum: ['INITIALIZED', 'HELD', 'RELEASED', 'REFUNDED', 'IN_DISPUTE'],
      default: 'INITIALIZED',
    },
    status: {
      type: String,
      enum: [
        'OFFER_ACCEPTED',
        'LOT_CONFIRMED',
        'PICKUP_SCHEDULED',
        'PICKUP_COMPLETED',
        'DELIVERED',
        'QUALITY_CHECKED',
        'PAYMENT_PENDING',
        'PAYMENT_COMPLETED',
      ],
      default: 'OFFER_ACCEPTED',
    },
    milestones: [milestoneSchema],
  },
  { timestamps: true }
);

export const Transaction =
  mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
