import { createFirestoreModel } from './firestoreAdapter.js';

export const Buyer = createFirestoreModel('buyers', { primaryKey: 'shopId' });

export default Buyer;
