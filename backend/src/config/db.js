// DB: Database connection manager with automatic fallback
import mongoose from 'mongoose';
import { ENV } from './env.js';

let mongodInstance = null;

export const connectDB = async () => {
  try {
    // Attempt connecting to configured MongoDB URI with a short timeout
    const options = {
      serverSelectionTimeoutMS: 3000
    };
    await mongoose.connect(ENV.MONGODB_URI, options);
    console.log(`[DB] Connected to MongoDB at: ${ENV.MONGODB_URI}`);
  } catch (primaryError) {
    console.warn(`[DB] Could not connect to primary MongoDB (${ENV.MONGODB_URI}): ${primaryError.message}`);
    console.log(`[DB] Initializing embedded MongoDB engine fallback...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[DB] Connected successfully to embedded MongoDB instance at: ${memoryUri}`);
    } catch (fallbackError) {
      console.error(`[DB] CRITICAL: Failed to initialize embedded MongoDB: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
