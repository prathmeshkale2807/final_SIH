import { BuyerRequirement } from '../models/BuyerRequirement.js';
import { isDBConnected } from '../config/db.js';

let requirementMemoryStore = [];

export const getMemoryRequirement = (id) => {
  return requirementMemoryStore.find((r) => r.requirementId === id || r.id === id);
};

export const getAllOpenRequirementsInMemory = () => {
  return requirementMemoryStore.filter((r) => (r.status || 'OPEN').toUpperCase() === 'OPEN');
};

export const createRequirement = async (req, res) => {
  try {
    const buyerId = req.user?.id || req.user?.shopId || 'BUY-2026-PN08';
    const buyerName = req.user?.businessName || req.user?.ownerName || 'Enterprise Sourcing Desk';

    const {
      cropName,
      crop,
      variety,
      quantity,
      unit,
      qualityRequirement,
      quality,
      maxBuyingPrice,
      maxPricePerKg,
      requiredByDate,
      requiredBy,
      deliveryPreference,
      requirementType,
      purchaseType,
      city,
      district,
      state,
      location,
      gpsCoords,
    } = req.body;

    const chosenCrop = (crop || cropName || '').trim();
    if (!chosenCrop) {
      return res.status(400).json({ success: false, message: 'Crop name is required' });
    }

    const numQuantity = Number(quantity);
    if (!numQuantity || numQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    const chosenMaxPrice = Number(maxPricePerKg || maxBuyingPrice);
    if (!chosenMaxPrice || chosenMaxPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Maximum buying price per KG must be greater than 0' });
    }

    const requirementId = `REQ-2026-${chosenCrop.substring(0, 2).toUpperCase()}-0${Math.floor(100 + Math.random() * 900)}`;

    const locCity = location?.city || city || 'Pune';
    const locDistrict = location?.district || district || locCity;
    const locState = location?.state || state || 'Maharashtra';
    const locAddress = location?.address || '';
    const locLat = location?.latitude || gpsCoords?.lat || null;
    const locLng = location?.longitude || gpsCoords?.lng || null;

    const newReqData = {
      requirementId,
      id: requirementId,
      buyerId,
      buyerName,
      crop: chosenCrop,
      variety: variety || 'Standard Variety',
      quantity: numQuantity,
      unit: unit || 'KG',
      quality: quality || qualityRequirement || 'Grade A',
      maxPricePerKg: chosenMaxPrice,
      requiredBy: requiredBy || requiredByDate || new Date().toISOString().split('T')[0],
      deliveryPreference: deliveryPreference || 'Farm Gate Pickup by Buyer Truck',
      purchaseType: purchaseType || requirementType || 'Spot Procurement',
      location: {
        address: locAddress,
        city: locCity,
        district: locDistrict,
        state: locState,
        latitude: locLat,
        longitude: locLng,
      },
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDBConnected()) {
      try {
        const created = await BuyerRequirement.create(newReqData);
        requirementMemoryStore.unshift(newReqData);
        return res.status(201).json({ success: true, message: 'Requirement posted successfully', requirement: created });
      } catch (dbErr) {}
    }

    requirementMemoryStore.unshift(newReqData);
    return res.status(201).json({ success: true, message: 'Requirement posted successfully', requirement: newReqData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyRequirements = async (req, res) => {
  try {
    const buyerId = req.user?.id || req.user?.shopId || 'BUY-2026-PN08';

    if (isDBConnected()) {
      try {
        const list = await BuyerRequirement.find({ buyerId }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, requirements: list });
      } catch (dbErr) {}
    }

    const list = requirementMemoryStore.filter((r) => r.buyerId === buyerId);
    return res.json({ success: true, count: list.length, requirements: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRequirements = async (req, res) => {
  try {
    if (isDBConnected()) {
      try {
        const list = await BuyerRequirement.find({ status: 'OPEN' }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, requirements: list });
      } catch (dbErr) {}
    }

    const openList = requirementMemoryStore.filter((r) => (r.status || 'OPEN').toUpperCase() === 'OPEN');
    return res.json({ success: true, count: openList.length, requirements: openList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      try {
        const item = await BuyerRequirement.findOne({ $or: [{ requirementId: id }, { _id: id }] });
        if (item) return res.json({ success: true, requirement: item });
      } catch (dbErr) {}
    }

    const item = requirementMemoryStore.find((r) => r.requirementId === id || r.id === id);
    if (item) return res.json({ success: true, requirement: item });

    return res.status(404).json({ success: false, message: 'Requirement not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const buyerId = req.user?.id || req.user?.shopId;

    if (isDBConnected()) {
      try {
        const item = await BuyerRequirement.findOne({ $or: [{ requirementId: id }, { _id: id }] });
        if (item && buyerId && item.buyerId !== buyerId) {
          return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        if (item) {
          Object.assign(item, req.body, { updatedAt: new Date() });
          await item.save();
          return res.json({ success: true, message: 'Requirement updated', requirement: item });
        }
      } catch (dbErr) {}
    }

    const idx = requirementMemoryStore.findIndex((r) => r.requirementId === id || r.id === id);
    if (idx !== -1) {
      requirementMemoryStore[idx] = { ...requirementMemoryStore[idx], ...req.body, updatedAt: new Date().toISOString() };
      return res.json({ success: true, message: 'Requirement updated', requirement: requirementMemoryStore[idx] });
    }

    return res.status(404).json({ success: false, message: 'Requirement not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequirementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const buyerId = req.user?.id || req.user?.shopId;

    if (isDBConnected()) {
      try {
        const item = await BuyerRequirement.findOne({ $or: [{ requirementId: id }, { _id: id }] });
        if (item && buyerId && item.buyerId !== buyerId) {
          return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        if (item) {
          item.status = status;
          item.updatedAt = new Date();
          await item.save();
          return res.json({ success: true, message: 'Status updated', requirement: item });
        }
      } catch (dbErr) {}
    }

    const idx = requirementMemoryStore.findIndex((r) => r.requirementId === id || r.id === id);
    if (idx !== -1) {
      requirementMemoryStore[idx].status = status;
      requirementMemoryStore[idx].updatedAt = new Date().toISOString();
      return res.json({ success: true, message: 'Status updated', requirement: requirementMemoryStore[idx] });
    }

    return res.status(404).json({ success: false, message: 'Requirement not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
