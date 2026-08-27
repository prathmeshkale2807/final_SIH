import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Farmer } from './models/Farmer.js';
import { Buyer } from './models/Buyer.js';
import { Produce } from './models/Produce.js';
import { BuyerRequirement } from './models/BuyerRequirement.js';
import { Offer } from './models/Offer.js';
import { Transaction } from './models/Transaction.js';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('Connecting to Firebase Cloud Firestore...');
    await connectDB();
    console.log('Firebase Connected. Clearing existing collections...');

    await Promise.all([
      Farmer.deleteMany({}),
      Buyer.deleteMany({}),
      Produce.deleteMany({}),
      BuyerRequirement.deleteMany({}),
      Offer.deleteMany({}),
      Transaction.deleteMany({}),
    ]);

    console.log('Inserting seed records into Firebase Firestore...');

    // 1. Seed Farmer
    const farmer = await Farmer.create({
      farmerId: 'FARM-2026-MH01',
      name: 'Rahul Jadhav',
      mobile: '9876543210',
      location: {
        village: 'Dindori',
        taluka: 'Dindori',
        district: 'Nashik',
        state: 'Maharashtra',
        latitude: 20.0059,
        longitude: 73.7897,
      },
      crops: {
        primaryCrop: 'Onion',
        otherCrops: 'Tomato, Soybean',
      },
      landArea: '6.5 Acres',
      role: 'farmer',
    });

    // 2. Seed Buyer
    const buyer = await Buyer.create({
      shopId: 'BUY-2026-PN08',
      shopName: 'AgroFresh Food Processors Ltd.',
      ownerName: 'Vikram Mehta',
      mobile: '9822012345',
      businessType: 'Food Processor & Exporter',
      location: {
        address: 'APMC Market Yard Gate 2',
        city: 'Pune',
        district: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
      },
      productsOfInterest: ['Onion', 'Tomato', 'Soybean'],
      monthlyRequirement: 500,
      trustScore: 98,
      verified: true,
      role: 'buyer',
    });

    // 3. Seed Produce
    const produce = await Produce.create({
      produceId: 'KS-2026-ON-0101',
      farmerId: farmer.farmerId,
      farmerName: farmer.name,
      crop: 'Onion',
      variety: 'Nashik Red Garwa',
      category: 'Vegetables',
      quantity: 500,
      unit: 'KG',
      quality: 'Grade A (Export / Processing Quality)',
      size: 'Medium (50mm - 65mm)',
      freshness: 'Fresh Harvest (< 24 hrs)',
      expectedPricePerKg: 18,
      location: {
        village: 'Dindori',
        district: 'Nashik',
        state: 'Maharashtra',
        latitude: 20.0059,
        longitude: 73.7897,
      },
      status: 'ACTIVE',
    });

    // 4. Seed Buyer Requirement
    const requirement = await BuyerRequirement.create({
      requirementId: 'REQ-2026-ON-0501',
      buyerId: buyer.shopId,
      buyerName: buyer.shopName,
      crop: 'Onion',
      variety: 'Nashik Red',
      quantity: 500,
      unit: 'KG',
      quality: 'Grade A',
      maxPricePerKg: 20,
      location: {
        address: 'APMC Yard',
        city: 'Pune',
        district: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
      },
      requiredBy: '2026-09-01',
      deliveryPreference: 'Farm Gate Pickup by Buyer Truck',
      purchaseType: 'Spot Procurement',
      status: 'OPEN',
    });

    console.log('=============================================');
    console.log('  🌾 KRISHAK DATABASE SEED COMPLETE          ');
    console.log(`  Farmer:      ${farmer.name} (${farmer.farmerId})`);
    console.log(`  Buyer:       ${buyer.shopName} (${buyer.shopId})`);
    console.log(`  Produce:     ${produce.crop} ${produce.quantity} KG (${produce.produceId})`);
    console.log(`  Requirement: ${requirement.crop} ${requirement.quantity} KG (${requirement.requirementId})`);
    console.log('=============================================');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
