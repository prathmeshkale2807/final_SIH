import { Offer } from '../models/Offer.js';
import { Produce } from '../models/Produce.js';
import { isDBConnected } from '../config/db.js';
import { getProduceByIdInMemory } from './produceController.js';
import { createTransactionForAcceptedOffer } from './transactionController.js';

let offerMemoryStore = [];

export const createOffer = async (req, res) => {
  try {
    const buyerId = req.user?.id || req.user?.shopId;
    const buyerName = req.user?.businessName || req.user?.shopName || req.user?.ownerName || 'Buyer Desk';
    const buyerTrustScore = req.user?.trustScore || 96;

    if (!buyerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Valid buyer session required' });
    }

    const {
      produceId,
      farmerId: reqFarmerId,
      requirementId,
      crop,
      offeredPricePerKg,
      price,
      quantity,
      unit,
      message,
      distance,
      distanceKm,
    } = req.body;

    if (!produceId) {
      return res.status(400).json({ success: false, message: 'Produce ID is required to create an offer' });
    }

    // 1. BACKEND DEDUPLICATION CHECK
    const activeStatuses = ['PENDING', 'NEGOTIATION', 'ACCEPTED'];
    
    if (isDBConnected()) {
      try {
        const existingOffer = await Offer.findOne({
          buyerId,
          produceId,
          status: { $in: activeStatuses },
        });

        if (existingOffer) {
          return res.status(409).json({
            success: false,
            code: 'DUPLICATE_OFFER',
            message: 'An active offer already exists for this produce lot.',
            offer: existingOffer,
          });
        }
      } catch (e) {}
    }

    const existingInMemory = offerMemoryStore.find(
      (o) => o.buyerId === buyerId && o.produceId === produceId && activeStatuses.includes(o.status)
    );
    if (existingInMemory) {
      return res.status(409).json({
        success: false,
        code: 'DUPLICATE_OFFER',
        message: 'An active offer already exists for this produce lot.',
        offer: existingInMemory,
      });
    }

    // 2. Lookup real produce lot
    let targetFarmerId = reqFarmerId;
    let targetCrop = crop;
    let targetVariety = 'Standard Variety';
    let targetQty = Number(quantity);
    let targetUnit = unit || 'KG';

    if (isDBConnected()) {
      try {
        const prod = await Produce.findOne({ $or: [{ produceId }, { _id: produceId }] });
        if (prod) {
          targetFarmerId = prod.farmerId;
          targetCrop = prod.crop;
          targetVariety = prod.variety || targetVariety;
          if (!targetQty) targetQty = prod.quantity;
          targetUnit = prod.unit || targetUnit;
        }
      } catch (e) {}
    }

    if (!targetFarmerId) {
      const prod = getProduceByIdInMemory(produceId);
      if (prod) {
        targetFarmerId = prod.farmerId;
        targetCrop = prod.crop;
        targetVariety = prod.variety || targetVariety;
        if (!targetQty) targetQty = prod.quantity;
        targetUnit = prod.unit || targetUnit;
      }
    }

    const offerId = `OFF-${Math.floor(100 + Math.random() * 900)}`;
    const finalPrice = Number(offeredPricePerKg || price) || 18.5;

    const newOffer = {
      offerId,
      id: offerId,
      produceId,
      requirementId: requirementId || null,
      buyerId,
      buyerName,
      buyerTrustScore,
      farmerId: targetFarmerId || 'FARM-2026-MH01',
      crop: targetCrop || 'Onion',
      variety: targetVariety,
      offeredPricePerKg: finalPrice,
      offeredPricePerQuintal: finalPrice * 100,
      priceFormatted: `₹${finalPrice}/kg`,
      quantity: targetQty || 100,
      unit: targetUnit,
      distance: distance || (distanceKm ? `${distanceKm} km (Farm Gate Pickup)` : '45 km (Farm Gate Pickup)'),
      trust: `${buyerTrustScore}/100`,
      message: message || 'Direct verified farm-gate procurement with 100% escrow settlement.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDBConnected()) {
      try {
        const created = await Offer.create(newOffer);
        offerMemoryStore.unshift(newOffer);
        return res.status(201).json({ success: true, message: 'Offer submitted to farmer', offer: created });
      } catch (dbErr) {}
    }

    offerMemoryStore.unshift(newOffer);
    return res.status(201).json({ success: true, message: 'Offer submitted to farmer', offer: newOffer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerOffers = async (req, res) => {
  try {
    const farmerId = req.user?.id || req.user?.farmerId;
    if (!farmerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (isDBConnected()) {
      try {
        const list = await Offer.find({ farmerId }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, offers: list });
      } catch (dbErr) {}
    }

    const list = offerMemoryStore.filter((o) => o.farmerId === farmerId);
    return res.json({ success: true, count: list.length, offers: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuyerOffers = async (req, res) => {
  try {
    const buyerId = req.user?.id || req.user?.shopId;
    if (!buyerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (isDBConnected()) {
      try {
        const list = await Offer.find({ buyerId }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, offers: list });
      } catch (dbErr) {}
    }

    const list = offerMemoryStore.filter((o) => o.buyerId === buyerId);
    return res.json({ success: true, count: list.length, offers: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    const farmerId = req.user?.id || req.user?.farmerId;

    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'NEGOTIATION', 'CANCELLED'];
    const newStatus = status ? status.toUpperCase() : null;

    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid offer status provided' });
    }

    let targetOffer = null;

    if (isDBConnected()) {
      try {
        targetOffer = await Offer.findOne({ $or: [{ offerId: id }, { _id: id }] });
      } catch (dbErr) {}
    }

    if (!targetOffer) {
      targetOffer = offerMemoryStore.find((o) => o.offerId === id || o.id === id);
    }

    if (!targetOffer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    // Verify ownership
    if (farmerId && targetOffer.farmerId !== farmerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Only the lot recipient can modify this offer' });
    }

    // Idempotent check
    if (targetOffer.status === newStatus) {
      return res.json({
        success: true,
        message: `Offer is already ${newStatus}`,
        offer: targetOffer,
      });
    }

    // Update Offer Status
    targetOffer.status = newStatus;
    if (message) targetOffer.message = message;
    targetOffer.updatedAt = new Date().toISOString();

    if (isDBConnected() && typeof targetOffer.save === 'function') {
      try {
        await targetOffer.save();
      } catch (e) {}
    }

    const memIdx = offerMemoryStore.findIndex((o) => o.offerId === id || o.id === id);
    if (memIdx !== -1) {
      offerMemoryStore[memIdx] = {
        ...offerMemoryStore[memIdx],
        status: newStatus,
        message: message || offerMemoryStore[memIdx].message,
        updatedAt: new Date().toISOString(),
      };
    }

    // WHEN OFFER IS ACCEPTED -> INITIALIZE TRANSACTION AUTOMATICALLY
    if (newStatus === 'ACCEPTED') {
      try {
        await createTransactionForAcceptedOffer(targetOffer, req.user?.name);
      } catch (txnErr) {
        console.error('Error creating transaction for accepted offer:', txnErr);
      }
    }

    return res.json({
      success: true,
      message: `Offer status successfully updated to ${newStatus}`,
      offer: targetOffer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
