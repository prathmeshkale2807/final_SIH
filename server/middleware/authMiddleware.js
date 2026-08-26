import jwt from 'jsonwebtoken';
import { verifyFirebaseIdToken, isFirebaseAdminInitialized } from '../config/firebase.js';
import { Farmer } from '../models/Farmer.js';
import { Buyer } from '../models/Buyer.js';
import { isDBConnected } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];

    // 1. Try standard KRISHAK JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'krishak_super_secret_jwt_key_2026');
      req.user = decoded;
      return next();
    } catch (jwtError) {
      // If JWT verification failed, attempt Firebase ID Token verification
    }

    // 2. Try Firebase ID Token verification if Firebase Admin is active
    if (isFirebaseAdminInitialized()) {
      try {
        const firebaseDecoded = await verifyFirebaseIdToken(token);
        req.firebaseUser = firebaseDecoded;
        const uid = firebaseDecoded.uid;
        const mobile = (firebaseDecoded.phone_number || '').replace('+91', '');

        let userRecord = null;
        if (isDBConnected()) {
          userRecord =
            (await Farmer.findOne({ $or: [{ firebaseUid: uid }, { mobile }] })) ||
            (await Buyer.findOne({ $or: [{ firebaseUid: uid }, { mobile }] }));
        }

        if (userRecord) {
          req.user = {
            id: userRecord.farmerId || userRecord.shopId || userRecord.id,
            farmerId: userRecord.farmerId,
            shopId: userRecord.shopId,
            role: userRecord.role || (userRecord.farmerId ? 'farmer' : 'buyer'),
            name: userRecord.name || userRecord.ownerName,
            mobile: userRecord.mobile || mobile,
            firebaseUid: uid,
          };
          return next();
        } else {
          req.user = {
            id: uid,
            role: 'authenticated',
            firebaseUid: uid,
            mobile,
          };
          return next();
        }
      } catch (fbError) {
        // Both JWT and Firebase token failed
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token',
    });
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to ${role}s only`,
      });
    }
    next();
  };
};
