import mongoose from 'mongoose';

export const isDBConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

export const getDBName = () => {
  if (isDBConnected() && mongoose.connection.db) {
    return mongoose.connection.db.databaseName || 'krishak_db';
  }
  return 'krishak_db';
};

export const getDBStatus = () => {
  return isDBConnected() ? 'connected' : 'disconnected';
};

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krishak_db';
  
  // Mask credentials for safe logging
  const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    
    console.log(`=========================================`);
    console.log(`  🌾 KRISHAK BACKEND                     `);
    console.log(`  MongoDB:  CONNECTED                    `);
    console.log(`  Database: ${conn.connection.name || 'krishak_db'}`);
    console.log(`  Host:     ${conn.connection.host}      `);
    console.log(`=========================================`);
    return true;
  } catch (error) {
    console.error(`=========================================`);
    console.error(`  ⚠️  KRISHAK BACKEND                    `);
    console.error(`  MongoDB:  DISCONNECTED                 `);
    console.error(`  Target:   ${maskedURI}                 `);
    console.error(`  Error:    ${error.message}             `);
    console.error(`  Action:   Check MongoDB connection / Atlas MONGO_URI in .env`);
    console.error(`=========================================`);
    return false;
  }
};
