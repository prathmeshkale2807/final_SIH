import { Transaction } from '../models/Transaction.js';
import { isDBConnected } from '../config/db.js';

let transactionMemoryStore = [];

export const MILESTONE_DEFINITIONS = [
  { key: 'OFFER_ACCEPTED', label: 'Offer Accepted & Escrow Initialized' },
  { key: 'LOT_CONFIRMED', label: 'Produce Lot Confirmed by Farmer' },
  { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled with Logistics' },
  { key: 'PICKUP_COMPLETED', label: 'Farm-Gate Pickup Completed' },
  { key: 'DELIVERED', label: 'Delivered to Buyer Facility' },
  { key: 'QUALITY_CHECKED', label: 'Quality & Weight Inspected' },
  { key: 'PAYMENT_COMPLETED', label: 'Escrow Payment Released & Settled' },
];

export const VALID_STATUS_FLOW = [
  'OFFER_ACCEPTED',
  'LOT_CONFIRMED',
  'PICKUP_SCHEDULED',
  'PICKUP_COMPLETED',
  'DELIVERED',
  'QUALITY_CHECKED',
  'PAYMENT_COMPLETED',
];

export const buildInitialMilestones = () => {
  const now = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return MILESTONE_DEFINITIONS.map((def, idx) => ({
    key: def.key,
    label: def.label,
    date: idx === 0 ? now : '',
    done: idx === 0,
  }));
};

/**
 * Creates exactly ONE Transaction for an accepted offer.
 * Guarantees idempotency and server-side totalAmount computation.
 */
export const createTransactionForAcceptedOffer = async (offer, farmerName = '') => {
  const offerKey = offer.offerId || offer.id;

  // 1. Idempotency Check in DB
  if (isDBConnected()) {
    try {
      const existing = await Transaction.findOne({ offerId: offerKey });
      if (existing) return existing;
    } catch (e) {}
  }

  // 2. Idempotency Check in Memory
  const existingMem = transactionMemoryStore.find((t) => t.offerId === offerKey);
  if (existingMem) return existingMem;

  // 3. Compute server-side financial values
  const qty = Number(offer.quantity) || 100;
  const unitRate = Number(offer.offeredPricePerKg || offer.price) || 18;
  const totalAmount = Math.round(qty * unitRate);

  const txnId = `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const escrowId = `ESC-${Math.floor(1000 + Math.random() * 9000)}`;

  const newTxnData = {
    txnId,
    id: txnId,
    escrowId,
    offerId: offerKey,
    produceId: offer.produceId || '',
    farmerId: offer.farmerId || 'FARM-2026-MH01',
    farmerName: farmerName || offer.farmerName || 'Rahul Jadhav',
    buyerId: offer.buyerId || 'BUY-2026-PN08',
    buyerName: offer.buyerName || 'AgroFresh Food Processors Ltd.',
    crop: offer.crop || 'Onion',
    variety: offer.variety || 'Standard Variety',
    quantity: qty,
    unit: offer.unit || 'KG',
    agreedPricePerKg: unitRate,
    totalAmount,
    pickupLocation: {
      address: 'Farm Gate',
      district: 'Nashik',
      state: 'Maharashtra',
      latitude: null,
      longitude: null,
    },
    deliveryLocation: {
      address: 'APMC Processing Facility',
      district: 'Pune',
      state: 'Maharashtra',
      latitude: null,
      longitude: null,
    },
    pickupDetails: {},
    inspectionDetails: {},
    escrowStatus: 'INITIALIZED',
    status: 'OFFER_ACCEPTED',
    milestones: buildInitialMilestones(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isDBConnected()) {
    try {
      const created = await Transaction.create(newTxnData);
      transactionMemoryStore.unshift(newTxnData);
      return created;
    } catch (e) {}
  }

  transactionMemoryStore.unshift(newTxnData);
  return newTxnData;
};

export const getFarmerTransactions = async (req, res) => {
  try {
    const farmerId = req.user?.id || req.user?.farmerId;
    if (!farmerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (isDBConnected()) {
      try {
        const list = await Transaction.find({ farmerId }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, transactions: list });
      } catch (dbErr) {}
    }

    const list = transactionMemoryStore.filter((t) => t.farmerId === farmerId);
    return res.json({ success: true, count: list.length, transactions: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuyerTransactions = async (req, res) => {
  try {
    const buyerId = req.user?.id || req.user?.shopId;
    if (!buyerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (isDBConnected()) {
      try {
        const list = await Transaction.find({ buyerId }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, transactions: list });
      } catch (dbErr) {}
    }

    const list = transactionMemoryStore.filter((t) => t.buyerId === buyerId);
    return res.json({ success: true, count: list.length, transactions: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || req.user?.farmerId || req.user?.shopId;

    let item = null;
    if (isDBConnected()) {
      try {
        item = await Transaction.findOne({ $or: [{ txnId: id }, { _id: id }] });
      } catch (dbErr) {}
    }

    if (!item) {
      item = transactionMemoryStore.find((t) => t.txnId === id || t.id === id);
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Authorization check
    if (userId && item.farmerId !== userId && item.buyerId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this transaction' });
    }

    return res.json({ success: true, transaction: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      milestoneKey,
      pickupDate,
      pickupTime,
      vehicleNumber,
      driverPhone,
      logisticsProvider,
      actualWeight,
      qualityGrade,
      inspectionNotes,
    } = req.body;

    const userId = req.user?.id || req.user?.farmerId || req.user?.shopId;
    const isFarmer = req.user?.role === 'farmer' || !!req.user?.farmerId;
    const isBuyer = req.user?.role === 'buyer' || !!req.user?.shopId;

    const targetStatus = (status || milestoneKey || '').toUpperCase();

    if (!targetStatus || !VALID_STATUS_FLOW.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid milestone status. Allowed order: ${VALID_STATUS_FLOW.join(' → ')}`,
      });
    }

    let txn = null;
    if (isDBConnected()) {
      try {
        txn = await Transaction.findOne({ $or: [{ txnId: id }, { _id: id }] });
      } catch (dbErr) {}
    }

    if (!txn) {
      txn = transactionMemoryStore.find((t) => t.txnId === id || t.id === id);
    }

    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // 1. Authorization check: authenticated user must be associated with the transaction
    if (userId && txn.farmerId !== userId && txn.buyerId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You are not a party to this transaction' });
    }

    // 2. State machine index & sequential step check
    const currentIndex = VALID_STATUS_FLOW.indexOf(txn.status || 'OFFER_ACCEPTED');
    const targetIndex = VALID_STATUS_FLOW.indexOf(targetStatus);

    // If already in target status, return idempotently
    if (currentIndex === targetIndex) {
      return res.json({
        success: true,
        message: `Transaction is already at milestone ${targetStatus}`,
        transaction: txn,
      });
    }

    if (targetIndex < currentIndex) {
      return res.status(400).json({
        success: false,
        message: `Cannot revert transaction status backwards from ${txn.status} to ${targetStatus}`,
      });
    }

    if (targetIndex > currentIndex + 1) {
      return res.status(400).json({
        success: false,
        message: `Invalid leap: Must complete ${VALID_STATUS_FLOW[currentIndex + 1]} before advancing to ${targetStatus}`,
      });
    }

    // 3. Strict Role-based checks per step
    if (targetStatus === 'LOT_CONFIRMED') {
      if (!isFarmer && txn.farmerId !== userId) {
        return res.status(403).json({ success: false, message: 'Only the farmer can confirm the harvest lot' });
      }
      txn.escrowStatus = 'HELD';
    } else if (targetStatus === 'PICKUP_SCHEDULED') {
      // Pickup details payload
      txn.pickupDetails = {
        scheduledDate: pickupDate || new Date().toISOString().split('T')[0],
        scheduledTime: pickupTime || '10:00 AM',
        vehicleNumber: vehicleNumber || 'MH-15-AG-4820',
        driverPhone: driverPhone || '9876500000',
        logisticsProvider: logisticsProvider || 'AgroLogistics Express (Farm-Gate Pickup Truck)',
        notes: req.body.notes || 'Transport arranged',
      };
      txn.escrowStatus = 'HELD';
    } else if (targetStatus === 'PICKUP_COMPLETED') {
      txn.pickupCompletedAt = new Date().toISOString();
      txn.escrowStatus = 'HELD';
    } else if (targetStatus === 'DELIVERED') {
      if (!isBuyer && txn.buyerId !== userId) {
        return res.status(403).json({ success: false, message: 'Only the buyer can confirm delivery at facility' });
      }
      txn.deliveredAt = new Date().toISOString();
      txn.escrowStatus = 'HELD';
    } else if (targetStatus === 'QUALITY_CHECKED') {
      if (!isBuyer && txn.buyerId !== userId) {
        return res.status(403).json({ success: false, message: 'Only the buyer can verify quality and weight' });
      }
      txn.inspectionDetails = {
        actualWeight: Number(actualWeight) || txn.quantity,
        qualityGrade: qualityGrade || 'Grade A (Verified)',
        notes: inspectionNotes || 'Inspected and certified for processing.',
        inspectedBy: req.user?.ownerName || req.user?.name || 'Authorized Quality Inspector',
        inspectedAt: new Date().toISOString(),
      };
      txn.escrowStatus = 'HELD';
    } else if (targetStatus === 'PAYMENT_COMPLETED') {
      if (!isBuyer && txn.buyerId !== userId) {
        return res.status(403).json({ success: false, message: 'Only the buyer can release the escrow payment' });
      }
      txn.paymentCompletedAt = new Date().toISOString();
      txn.escrowStatus = 'RELEASED';
    }

    const now = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    txn.status = targetStatus;
    txn.updatedAt = new Date().toISOString();

    if (Array.isArray(txn.milestones)) {
      txn.milestones.forEach((m, idx) => {
        if (idx <= targetIndex) {
          m.done = true;
          if (!m.date) m.date = now;
        }
      });
    }

    if (isDBConnected() && typeof txn.save === 'function') {
      try {
        await txn.save();
      } catch (e) {}
    }

    const memIdx = transactionMemoryStore.findIndex((t) => t.txnId === id || t.id === id);
    if (memIdx !== -1) {
      transactionMemoryStore[memIdx] = {
        ...transactionMemoryStore[memIdx],
        status: targetStatus,
        escrowStatus: txn.escrowStatus,
        pickupDetails: txn.pickupDetails,
        inspectionDetails: txn.inspectionDetails,
        pickupCompletedAt: txn.pickupCompletedAt,
        deliveredAt: txn.deliveredAt,
        paymentCompletedAt: txn.paymentCompletedAt,
        milestones: txn.milestones,
        updatedAt: new Date().toISOString(),
      };
    }

    return res.json({
      success: true,
      message: `Transaction milestone successfully advanced to ${targetStatus}`,
      transaction: txn,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInMemoryTransactions = () => transactionMemoryStore;
