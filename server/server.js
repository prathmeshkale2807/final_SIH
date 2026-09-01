import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDBConnected, getDBStatus, getDBName } from './config/db.js';
import { initFirebaseAdmin } from './config/firebase.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { marketIngestionService } from './services/marketIngestionService.js';

// 1. Load environment variables
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000';

// 2. Allowed origins for development & Vercel production
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

// 3. Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow for mobile apps & webhooks
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lightweight cookie parsing middleware for Vercel serverless
app.use((req, res, next) => {
  req.cookies = req.cookies || {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts[0]?.trim();
      const val = parts.slice(1).join('=').trim();
      if (name) req.cookies[name] = decodeURIComponent(val);
    });
  }
  next();
});

// 4. API Health endpoint reporting real backend and database status
app.get('/api/health', (req, res) => {
  const connected = isDBConnected();
  res.status(200).json({
    success: connected,
    backend: 'running',
    environment: process.env.NODE_ENV || 'development',
    database: getDBStatus(),
    databaseName: getDBName(),
    timestamp: new Date().toISOString(),
  });
});

// 5. Mount all API routes
app.use('/api', apiRoutes);

// 5b. ORS Routing Proxy — avoids browser CORS restrictions
app.post('/api/ors/directions/:profile', async (req, res) => {
  const { profile } = req.params;
  const ORS_KEY = process.env.ORS_API_KEY || '';
  const validProfiles = ['driving-hgv', 'driving-car', 'cycling-road', 'foot-walking'];

  if (!validProfiles.includes(profile)) {
    return res.status(400).json({ error: 'Invalid ORS profile' });
  }

  try {
    const orsRes = await fetch(
      `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
      {
        method: 'POST',
        headers: {
          Authorization: ORS_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await orsRes.json();
    if (!orsRes.ok) {
      return res.status(orsRes.status).json({ error: data.error || 'ORS error' });
    }
    return res.json(data);
  } catch (err) {
    console.error('[ORS Proxy] Error:', err.message);
    return res.status(502).json({ error: 'ORS proxy failed', detail: err.message });
  }
});

// 6. Fallback Error Handling
app.use(notFound);
app.use(errorHandler);

// 7. Connect to Firebase / Database
connectDB().catch((err) => console.warn('[DB Connect Notice]:', err.message));
initFirebaseAdmin();

// 8. Start server locally if not running on Vercel Serverless
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  marketIngestionService.startMarketScheduler();
  app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`  🌾 KRISHAK BACKEND SERVER RUNNING          `);
    console.log(`  Server:    http://localhost:${PORT}        `);
    console.log(`  Health:    http://localhost:${PORT}/api/health`);
    console.log(`  SMS:       ${process.env.SMS_PROVIDER || 'local-dev-logger'}`);
    console.log(`=============================================`);
  });
}

export default app;
