import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { marketIngestionService } from '../services/marketIngestionService.js';

dotenv.config();

async function runSync() {
  console.log('=============================================');
  console.log('  🌾 KRISHAK MARKET DATA INGESTION SYNC     ');
  console.log('=============================================');

  await connectDB();

  console.log('Starting daily market data ingestion from AGMARKNET & NAFED...');
  const res = await marketIngestionService.ingestDailyMarketData();

  console.log('---------------------------------------------');
  console.log('  Sync Result:');
  console.log(`  - Success:            ${res.success}`);
  console.log(`  - Sources:            ${res.source}`);
  console.log(`  - Records Fetched:    ${res.recordsFetched}`);
  console.log(`  - Records Inserted:   ${res.recordsInserted}`);
  console.log(`  - Records Updated:    ${res.recordsUpdated}`);
  console.log(`  - Duplicates Skipped: ${res.duplicatesSkipped}`);
  console.log(`  - Errors:             ${res.errors}`);
  console.log('=============================================');

  process.exit(0);
}

runSync().catch((err) => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
