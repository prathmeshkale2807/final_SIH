import { Produce } from '../models/Produce.js';
import { isDBConnected } from '../config/db.js';

// Dynamic in-memory store for development/runtime fallback when MongoDB is offline
let produceMemoryStore = [];

export const getAllActiveProducesInMemory = () => {
  return produceMemoryStore.filter((p) => (p.status || 'ACTIVE').toUpperCase() === 'ACTIVE');
};

export const getProduceByIdInMemory = (id) => {
  return produceMemoryStore.find((p) => p.produceId === id || p.id === id);
};

export const createProduce = async (req, res) => {
  try {
    // Authenticated farmer ID from JWT
    const farmerId = req.user?.id || req.user?.farmerId || 'FARM-2026-MH01';
    const farmerName = req.user?.name || 'Rahul Jadhav';

    const {
      cropName,
      crop,
      variety,
      category,
      quantity,
      unit,
      qualityGrade,
      quality,
      size,
      freshness,
      harvestDate,
      expectedPrice,
      expectedPricePerKg,
      location,
      village,
      taluka,
      district,
      state,
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

    const chosenPrice = Number(expectedPricePerKg || expectedPrice);
    if (!chosenPrice || chosenPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Expected price per KG must be greater than 0' });
    }

    const locVillage = location?.village || village || '';
    const locTaluka = location?.taluka || taluka || '';
    const locDistrict = location?.district || district || 'Nashik';
    const locState = location?.state || state || 'Maharashtra';
    const locLat = location?.latitude || gpsCoords?.lat || null;
    const locLng = location?.longitude || gpsCoords?.lng || null;

    const chosenQuality = quality || qualityGrade || 'Grade A';
    const chosenUnit = unit || 'KG';
    const produceId = `KS-2026-${chosenCrop.substring(0, 2).toUpperCase()}-0${Math.floor(100 + Math.random() * 900)}`;

    const newProduceData = {
      produceId,
      id: produceId,
      farmerId,
      farmerName,
      crop: chosenCrop,
      variety: variety || 'Standard Variety',
      category: category || 'Agricultural Produce',
      quantity: numQuantity,
      unit: chosenUnit,
      quality: chosenQuality,
      size: size || 'Medium (45mm - 60mm)',
      freshness: freshness || 'Fresh Harvest (< 48 hrs)',
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      expectedPricePerKg: chosenPrice,
      location: {
        village: locVillage,
        taluka: locTaluka,
        district: locDistrict,
        state: locState,
        latitude: locLat,
        longitude: locLng,
      },
      status: 'ACTIVE',
      views: 0,
      inquiries: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDBConnected()) {
      try {
        const created = await Produce.create(newProduceData);
        produceMemoryStore.unshift(newProduceData);
        return res.status(201).json({
          success: true,
          message: 'Produce listed successfully',
          produce: created,
        });
      } catch (dbErr) {}
    }

    produceMemoryStore.unshift(newProduceData);
    return res.status(201).json({
      success: true,
      message: 'Produce listed successfully',
      produce: newProduceData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProduce = async (req, res) => {
  try {
    const farmerId = req.user?.id || req.user?.farmerId || 'FARM-2026-MH01';

    if (isDBConnected()) {
      try {
        const list = await Produce.find({ farmerId }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, produces: list });
      } catch (dbErr) {}
    }

    const list = produceMemoryStore.filter((p) => p.farmerId === farmerId);
    return res.json({ success: true, count: list.length, produces: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProduce = async (req, res) => {
  try {
    if (isDBConnected()) {
      try {
        const list = await Produce.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });
        return res.json({ success: true, count: list.length, produces: list });
      } catch (dbErr) {}
    }

    const activeList = produceMemoryStore.filter((p) => (p.status || 'ACTIVE').toUpperCase() === 'ACTIVE');
    return res.json({ success: true, count: activeList.length, produces: activeList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProduceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      try {
        const item = await Produce.findOne({ $or: [{ produceId: id }, { _id: id }] });
        if (item) return res.json({ success: true, produce: item });
      } catch (dbErr) {}
    }

    const item = produceMemoryStore.find((p) => p.produceId === id || p.id === id);
    if (item) return res.json({ success: true, produce: item });

    return res.status(404).json({ success: false, message: 'Produce lot not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduce = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user?.id || req.user?.farmerId;

    if (isDBConnected()) {
      try {
        const item = await Produce.findOne({ $or: [{ produceId: id }, { _id: id }] });
        if (item && farmerId && item.farmerId !== farmerId) {
          return res.status(403).json({ success: false, message: 'Unauthorized: Only the lot owner can modify this produce' });
        }
        if (item) {
          Object.assign(item, req.body, { updatedAt: new Date() });
          await item.save();
          return res.json({ success: true, message: 'Produce updated successfully', produce: item });
        }
      } catch (dbErr) {}
    }

    const idx = produceMemoryStore.findIndex((p) => p.produceId === id || p.id === id);
    if (idx !== -1) {
      produceMemoryStore[idx] = { ...produceMemoryStore[idx], ...req.body, updatedAt: new Date().toISOString() };
      return res.json({ success: true, message: 'Produce updated successfully', produce: produceMemoryStore[idx] });
    }

    return res.status(404).json({ success: false, message: 'Produce not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProduceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['ACTIVE', 'PAUSED', 'SOLD', 'EXPIRED', 'CANCELLED'];
    const newStatus = status && validStatuses.includes(status.toUpperCase()) ? status.toUpperCase() : null;

    if (isDBConnected()) {
      try {
        const item = await Produce.findOne({ $or: [{ produceId: id }, { _id: id }] });
        if (item) {
          item.status = newStatus || (item.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE');
          item.updatedAt = new Date();
          await item.save();
          return res.json({ success: true, message: `Produce status updated to ${item.status}`, produce: item });
        }
      } catch (dbErr) {}
    }

    const idx = produceMemoryStore.findIndex((p) => p.produceId === id || p.id === id);
    if (idx !== -1) {
      const updatedStatus = newStatus || (produceMemoryStore[idx].status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE');
      produceMemoryStore[idx].status = updatedStatus;
      produceMemoryStore[idx].updatedAt = new Date().toISOString();
      return res.json({ success: true, message: `Produce status updated to ${updatedStatus}`, produce: produceMemoryStore[idx] });
    }

    return res.status(404).json({ success: false, message: 'Produce not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduce = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user?.id || req.user?.farmerId;

    if (isDBConnected()) {
      try {
        const item = await Produce.findOne({ $or: [{ produceId: id }, { _id: id }] });
        if (item && farmerId && item.farmerId !== farmerId) {
          return res.status(403).json({ success: false, message: 'Unauthorized: Only the lot owner can delete this produce' });
        }
        await Produce.deleteOne({ $or: [{ produceId: id }, { _id: id }] });
      } catch (dbErr) {}
    }

    produceMemoryStore = produceMemoryStore.filter((p) => p.produceId !== id && p.id !== id);
    return res.json({ success: true, message: 'Produce lot removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
