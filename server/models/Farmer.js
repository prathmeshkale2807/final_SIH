import { createFirestoreModel } from './firestoreAdapter.js';

export const Farmer = createFirestoreModel('farmers', { primaryKey: 'farmerId' });

export default Farmer;
