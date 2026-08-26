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

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// 2. Allowed origins for development & production
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
      // Allow requests with no origin (like mobile apps, curl, postman) or from allowed list
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// 4. API Health endpoint reporting real backend, MongoDB, and Firebase status
app.get('/api/health', (req, res) => {
  const connected = isDBConnected();
  res.status(200).json({
    success: connected,
    backend: 'running',
    database: getDBStatus(),
    databaseName: getDBName(),
    authMode: process.env.AUTH_MODE || 'mock',
    timestamp: new Date().toISOString(),
  });
});

// 5. Mount all API routes
app.use('/api', apiRoutes);

// 6. Fallback Error Handling
app.use(notFound);
app.use(errorHandler);

// 7. Connect to MongoDB and start server
async function startServer() {
  await connectDB();

  // Initialize Firebase Admin SDK safely (standby in mock mode)
  initFirebaseAdmin();

  // Start market scheduler for daily ingestion & initial sync
  marketIngestionService.startMarketScheduler();

  app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`  🌾 KRISHAK BACKEND SERVER RUNNING       `);
    console.log(`  Server:    http://localhost:${PORT}      `);
    console.log(`  Health:    http://localhost:${PORT}/api/health`);
    console.log(`  Auth Mode: ${process.env.AUTH_MODE || 'mock'} (OTP: 123456)`);
    console.log(`=============================================`);
  });
}

startServer();
