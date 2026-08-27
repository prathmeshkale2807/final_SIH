import { createFirestoreModel } from './firestoreAdapter.js';

export const BuyerRequirement = createFirestoreModel('requirements', { primaryKey: 'requirementId' });

export default BuyerRequirement;
