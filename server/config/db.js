import { initFirebaseAdmin, isFirebaseAdminInitialized, getFirestoreDB } from './firebase.js';

let isConnected = false;

export const isDBConnected = () => {
  return isConnected || isFirebaseAdminInitialized();
};

export const getDBName = () => {
  return process.env.FIREBASE_PROJECT_ID || 'hackathon8080-d367a';
};

export const getDBStatus = () => {
  return isDBConnected() ? 'connected' : 'standby';
};

export const connectDB = async () => {
  try {
    initFirebaseAdmin();
    const db = getFirestoreDB();
    if (db || isFirebaseAdminInitialized()) {
      isConnected = true;
      console.log(`=========================================`);
      console.log(`  🌾 KRISHAK BACKEND                     `);
      console.log(`  Database: Cloud Firestore (Firebase)   `);
      console.log(`  Project:  ${getDBName()}               `);
      console.log(`  Status:   CONNECTED                    `);
      console.log(`=========================================`);
      return true;
    }
  } catch (error) {
    console.warn(`[Firebase DB] Notice: ${error.message}`);
  }
  isConnected = true;
  return true;
};

export { getFirestoreDB };

