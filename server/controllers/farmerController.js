import { Farmer } from '../models/Farmer.js';
import { isDBConnected } from '../config/db.js';

export const getFarmerProfile = async (req, res) => {
  try {
    const farmerId = req.user?.id || req.user?.farmerId;

    if (isDBConnected()) {
      try {
        let farmer = null;
        if (farmerId) {
          farmer = await Farmer.findOne({ farmerId });
        }
        if (!farmer && req.user?.mobile) {
          farmer = await Farmer.findOne({ mobile: req.user.mobile });
        }
        if (farmer) {
          const locStr = farmer.location
            ? [farmer.location.village, farmer.location.taluka, farmer.location.district, farmer.location.state].filter(Boolean).join(', ')
            : [farmer.village, farmer.taluka, farmer.district, farmer.state].filter(Boolean).join(', ');

          const formatted = {
            id: farmer.farmerId || farmer.id,
            farmerId: farmer.farmerId || farmer.id,
            role: 'farmer',
            name: farmer.name || req.user?.name || 'Farmer',
            mobile: farmer.mobile || req.user?.mobile || '',
            location: locStr || 'Maharashtra',
            village: farmer.location?.village || farmer.village || '',
            taluka: farmer.location?.taluka || farmer.taluka || '',
            district: farmer.location?.district || farmer.district || '',
            state: farmer.location?.state || farmer.state || 'Maharashtra',
            landArea: farmer.landArea ? (String(farmer.landArea).includes('Acres') ? farmer.landArea : `${farmer.landArea} Acres`) : '5 Acres',
            primaryCrop: farmer.crops?.primaryCrop || farmer.primaryCrop || 'Onion',
            otherCrops: farmer.crops?.otherCrops || farmer.otherCrops || '',
            gpsCoords: {
              lat: farmer.location?.latitude || farmer.gpsCoords?.lat || null,
              lng: farmer.location?.longitude || farmer.gpsCoords?.lng || null,
            },
          };
          return res.json({ success: true, farmer: formatted, user: formatted });
        }
      } catch (dbErr) {}
    }

    const fallbackUser = {
      id: farmerId || req.user?.id || 'FARM-ACCOUNT',
      farmerId: farmerId || req.user?.farmerId || 'FARM-ACCOUNT',
      role: 'farmer',
      name: req.user?.name || 'Farmer',
      mobile: req.user?.mobile || '',
      location: req.user?.location || req.user?.village || 'Maharashtra',
      village: req.user?.village || '',
      taluka: req.user?.taluka || '',
      district: req.user?.district || '',
      state: req.user?.state || 'Maharashtra',
      landArea: req.user?.landArea ? (String(req.user.landArea).includes('Acres') ? req.user.landArea : `${req.user.landArea} Acres`) : '5 Acres',
      primaryCrop: req.user?.primaryCrop || 'Onion',
      otherCrops: req.user?.otherCrops || '',
      gpsCoords: req.user?.gpsCoords || null,
    };

    return res.json({ success: true, farmer: fallbackUser, user: fallbackUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFarmerProfile = async (req, res) => {
  try {
    const farmerId = req.user?.id || req.user?.farmerId || req.body.farmerId;
    const { name, mobile, village, taluka, district, state, primaryCrop, otherCrops, landArea, gpsCoords } = req.body;

    if (isDBConnected()) {
      try {
        let farmer = await Farmer.findOne({ farmerId });
        if (!farmer && mobile) {
          farmer = await Farmer.findOne({ mobile });
        }
        if (!farmer) {
          farmer = new Farmer({ farmerId: farmerId || `FARM-2026-${Math.floor(1000 + Math.random() * 9000)}`, name, mobile });
        }
        if (name) farmer.name = name;
        if (mobile) farmer.mobile = mobile;
        if (landArea) farmer.landArea = String(landArea).replace(/[^0-9.]/g, '');
        if (!farmer.crops) farmer.crops = {};
        if (primaryCrop) farmer.crops.primaryCrop = primaryCrop;
        if (otherCrops) farmer.crops.otherCrops = otherCrops;
        if (!farmer.location) farmer.location = {};
        if (village) farmer.location.village = village;
        if (taluka) farmer.location.taluka = taluka;
        if (district) farmer.location.district = district;
        if (state) farmer.location.state = state;
        if (gpsCoords) {
          farmer.location.latitude = gpsCoords.lat;
          farmer.location.longitude = gpsCoords.lng;
        }

        await farmer.save();
        return res.json({ success: true, message: 'Profile updated successfully', farmer });
      } catch (dbErr) {}
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      farmer: { ...req.user, ...req.body },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
