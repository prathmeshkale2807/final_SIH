import admin from 'firebase-admin';
import fs from 'fs';

let firebaseApp = null;
let isInitialized = false;

/**
 * Initializes Firebase Admin SDK safely
 */
export const initFirebaseAdmin = () => {
  if (isInitialized) return firebaseApp;

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      isInitialized = true;
      console.log('  🔥 Firebase Admin SDK:   INITIALIZED (via Service Account File)');
    } else if (serviceAccountKeyJson) {
      const serviceAccount = JSON.parse(serviceAccountKeyJson);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      isInitialized = true;
      console.log('  🔥 Firebase Admin SDK:   INITIALIZED (via Service Account Key)');
    } else if (process.env.FIREBASE_PROJECT_ID) {
      firebaseApp = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      isInitialized = true;
      console.log(`  🔥 Firebase Admin SDK:   INITIALIZED (Project: ${process.env.FIREBASE_PROJECT_ID})`);
    } else {
      console.log('  🔥 Firebase Admin SDK:   STANDBY (Set FIREBASE_SERVICE_ACCOUNT_KEY in .env for live token verification)');
    }
  } catch (error) {
    console.warn(`[Firebase Admin] Initialization notice: ${error.message}`);
  }

  return firebaseApp;
};

export const isFirebaseAdminInitialized = () => isInitialized;

export const getFirebaseAdminAuth = () => {
  if (!isInitialized) {
    initFirebaseAdmin();
  }
  return isInitialized ? admin.auth() : null;
};

export const getFirestoreDB = () => {
  if (!isInitialized) {
    initFirebaseAdmin();
  }
  try {
    return isInitialized ? admin.firestore() : null;
  } catch (err) {
    return null;
  }
};

/**
 * Verifies a Firebase ID Token sent from the frontend
 */
export const verifyFirebaseIdToken = async (idToken) => {
  const auth = getFirebaseAdminAuth();
  if (!auth) {
    throw new Error('Firebase Admin Auth is not initialized. Check server environment variables.');
  }
  return await auth.verifyIdToken(idToken);
};

export default admin;

