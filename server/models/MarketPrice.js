import { createFirestoreModel } from './firestoreAdapter.js';

export const MarketPrice = createFirestoreModel('market_prices', { primaryKey: 'id' });

export default MarketPrice;
