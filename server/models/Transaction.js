import { createFirestoreModel } from './firestoreAdapter.js';

export const Transaction = createFirestoreModel('transactions', { primaryKey: 'transactionId' });

export default Transaction;
