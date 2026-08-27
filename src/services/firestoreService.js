import { db, auth } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

export const firestoreService = {
  /**
   * Save a farmer account to Firebase Cloud Firestore
   */
  saveFarmer: async (farmerData) => {
    try {
      const farmerId = farmerData.farmerId || farmerData.id || `FARM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const docRef = doc(db, 'farmers', farmerId);
      
      const payload = {
        farmerId,
        id: farmerId,
        name: farmerData.name || 'Farmer',
        mobile: farmerData.mobile || '',
        village: farmerData.village || '',
        taluka: farmerData.taluka || '',
        district: farmerData.district || 'Nashik',
        state: farmerData.state || 'Maharashtra',
        primaryCrop: farmerData.primaryCrop || 'Onion',
        otherCrops: farmerData.otherCrops || '',
        landArea: farmerData.landArea || '5',
        gpsCoords: farmerData.gpsCoords || null,
        firebaseUid: farmerData.firebaseUid || auth.currentUser?.uid || '',
        role: 'farmer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, payload, { merge: true });
      console.log('[Firestore] Farmer successfully saved to Firebase:', farmerId);
      return { success: true, farmer: payload };
    } catch (err) {
      console.warn('[Firestore] Notice saving farmer to Firebase:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Save a buyer account to Firebase Cloud Firestore
   */
  saveBuyer: async (buyerData) => {
    try {
      const shopId = buyerData.shopId || buyerData.id || `BUY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const docRef = doc(db, 'buyers', shopId);
      
      const payload = {
        shopId,
        id: shopId,
        businessName: buyerData.businessName || buyerData.shopName || 'Enterprise Buyer',
        shopName: buyerData.shopName || buyerData.businessName || 'Enterprise Buyer',
        ownerName: buyerData.ownerName || 'Buyer',
        mobile: buyerData.mobile || '',
        businessType: buyerData.businessType || 'Food Processor',
        cropInterests: buyerData.cropInterests || ['Onion', 'Tomato'],
        productsOfInterest: buyerData.productsOfInterest || buyerData.cropInterests || ['Onion', 'Tomato'],
        monthlyRequirement: Number(buyerData.monthlyRequirement) || 200,
        city: buyerData.city || 'Pune',
        district: buyerData.district || 'Pune',
        state: buyerData.state || 'Maharashtra',
        address: buyerData.address || '',
        firebaseUid: buyerData.firebaseUid || auth.currentUser?.uid || '',
        role: 'buyer',
        trustScore: 85,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(docRef, payload, { merge: true });
      console.log('[Firestore] Buyer successfully saved to Firebase:', shopId);
      return { success: true, buyer: payload };
    } catch (err) {
      console.warn('[Firestore] Notice saving buyer to Firebase:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Save a produce listing to Firebase Cloud Firestore
   */
  saveProduce: async (produceData) => {
    try {
      const produceId = produceData.produceId || produceData.id || `KS-2026-PR-${Math.floor(1000 + Math.random() * 9000)}`;
      const docRef = doc(db, 'produces', produceId);
      const payload = {
        ...produceData,
        produceId,
        id: produceId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, payload, { merge: true });
      console.log('[Firestore] Produce saved to Firebase:', produceId);
      return { success: true, produce: payload };
    } catch (err) {
      console.warn('[Firestore] Notice saving produce to Firebase:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Save a buyer requirement to Firebase Cloud Firestore
   */
  saveRequirement: async (reqData) => {
    try {
      const requirementId = reqData.requirementId || reqData.id || `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const docRef = doc(db, 'requirements', requirementId);
      const payload = {
        ...reqData,
        requirementId,
        id: requirementId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, payload, { merge: true });
      console.log('[Firestore] Requirement saved to Firebase:', requirementId);
      return { success: true, requirement: payload };
    } catch (err) {
      console.warn('[Firestore] Notice saving requirement to Firebase:', err.message);
      return { success: false, error: err.message };
    }
  },
};
