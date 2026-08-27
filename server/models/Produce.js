import { createFirestoreModel } from './firestoreAdapter.js';

export const Produce = createFirestoreModel('produces', { primaryKey: 'produceId' });

export default Produce;
