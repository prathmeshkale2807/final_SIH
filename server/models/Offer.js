import { createFirestoreModel } from './firestoreAdapter.js';

export const Offer = createFirestoreModel('offers', { primaryKey: 'offerId' });

export default Offer;
