import { Buyer } from '../models/Buyer.js';
import { isDBConnected } from '../config/db.js';

// Active in-memory fallback for buyer profiles
let buyerMemoryStore = [
  {
    shopId: 'BUY-2026-PN08',
    id: 'BUY-2026-PN08',
    shopName: 'AgroFresh Food Processors Ltd.',
    businessName: 'AgroFresh Food Processors Ltd.',
    ownerName: 'Vikram Mehta',
    mobile: '9822012345',
    businessType: 'Food Processor & Bulk Buyer',
    location: {
      address: 'Pune APMC Market Yard, Gate 2',
      city: 'Pune',
      district: 'Pune',
      state: 'Maharashtra',
      latitude: 18.5204,
      longitude: 73.8567,
    },
    productsOfInterest: ['Onion', 'Tomato', 'Soybean'],
    monthlyRequirement: 200,
    preferredQuality: 'Grade A (Export / Processing Quality)',
    trustScore: 96,
    verified: true,
    role: 'buyer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getBuyerProfile = async (req, res) => {
  try {
    const shopId = req.user?.id || req.user?.shopId || 'BUY-2026-PN08';

    if (isDBConnected()) {
      try {
        const buyer = await Buyer.findOne({ $or: [{ shopId }, { _id: shopId }] });
        if (buyer) {
          return res.json({
            success: true,
            buyer: {
              id: buyer.shopId,
              shopId: buyer.shopId,
              shopName: buyer.shopName,
              businessName: buyer.shopName,
              ownerName: buyer.ownerName,
              mobile: buyer.mobile,
              businessType: buyer.businessType,
              location: buyer.location ? `${buyer.location.city || 'Pune'}, ${buyer.location.state || 'Maharashtra'}` : 'Pune, Maharashtra',
              city: buyer.location?.city || 'Pune',
              district: buyer.location?.district || 'Pune',
              state: buyer.location?.state || 'Maharashtra',
              address: buyer.location?.address || '',
              latitude: buyer.location?.latitude || null,
              longitude: buyer.location?.longitude || null,
              productsOfInterest: buyer.productsOfInterest || ['Onion', 'Tomato'],
              monthlyRequirement: buyer.monthlyRequirement || 200,
              trustScore: buyer.trustScore || 96,
              verified: buyer.verified !== undefined ? buyer.verified : true,
              role: 'buyer',
            },
          });
        }
      } catch (dbErr) {}
    }

    let buyer = buyerMemoryStore.find((b) => b.shopId === shopId || b.id === shopId);
    if (!buyer) {
      buyer = {
        shopId,
        id: shopId,
        shopName: req.user?.name ? `${req.user.name}'s Enterprise` : 'Enterprise Procurement Desk',
        businessName: req.user?.name ? `${req.user.name}'s Enterprise` : 'Enterprise Procurement Desk',
        ownerName: req.user?.name || req.user?.ownerName || 'Buyer',
        mobile: req.user?.mobile || '9822012345',
        businessType: 'Food Processor',
        location: { city: 'Pune', district: 'Pune', state: 'Maharashtra' },
        trustScore: 90,
        verified: false,
        role: 'buyer',
      };
      buyerMemoryStore.push(buyer);
    }

    return res.json({
      success: true,
      buyer: {
        id: buyer.shopId || buyer.id,
        shopId: buyer.shopId || buyer.id,
        shopName: buyer.shopName || buyer.businessName,
        businessName: buyer.shopName || buyer.businessName,
        ownerName: buyer.ownerName,
        mobile: buyer.mobile,
        businessType: buyer.businessType,
        location: buyer.location ? `${buyer.location.city || 'Pune'}, ${buyer.location.state || 'Maharashtra'}` : 'Pune, Maharashtra',
        city: buyer.location?.city || 'Pune',
        district: buyer.location?.district || 'Pune',
        state: buyer.location?.state || 'Maharashtra',
        address: buyer.location?.address || '',
        latitude: buyer.location?.latitude || null,
        longitude: buyer.location?.longitude || null,
        productsOfInterest: buyer.productsOfInterest || ['Onion', 'Tomato'],
        monthlyRequirement: buyer.monthlyRequirement || 200,
        trustScore: buyer.trustScore || 90,
        verified: buyer.verified !== undefined ? buyer.verified : false,
        role: 'buyer',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBuyerProfile = async (req, res) => {
  try {
    const shopId = req.user?.id || req.user?.shopId || 'BUY-2026-PN08';

    if (isDBConnected()) {
      try {
        const buyer = await Buyer.findOne({ $or: [{ shopId }, { _id: shopId }] });
        if (buyer) {
          Object.assign(buyer, req.body);
          await buyer.save();
          return res.json({ success: true, message: 'Buyer profile updated successfully', buyer });
        }
      } catch (dbErr) {}
    }

    const idx = buyerMemoryStore.findIndex((b) => b.shopId === shopId || b.id === shopId);
    if (idx !== -1) {
      buyerMemoryStore[idx] = { ...buyerMemoryStore[idx], ...req.body, updatedAt: new Date().toISOString() };
      return res.json({ success: true, message: 'Buyer profile updated successfully', buyer: buyerMemoryStore[idx] });
    }

    return res.status(404).json({ success: false, message: 'Buyer profile not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const registerBuyerInMemory = (buyerData) => {
  buyerMemoryStore.unshift(buyerData);
};
