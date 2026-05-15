import mongoose from 'mongoose';
import { createError } from 'h3';
import { sendDiscordLog } from './discordLogger';

let connectPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectPromise) {
    await connectPromise;
    return mongoose;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const msg = 'MONGODB_URI is not set in environment variables.';
    console.error('[Sanovise - Error] ' + msg);
    await sendDiscordLog(msg, 'ERROR');
    throw createError({ statusCode: 500, statusMessage: msg });
  }

  connectPromise = mongoose.connect(uri);

  try {
    await connectPromise;
    console.log('[Sanovise - Info] Connected to MongoDB.');
    await sendDiscordLog('Connected to MongoDB.', 'INFO');
    return mongoose;
  } catch (err: any) {
    console.error('[Sanovise - Error] Failed to connect to MongoDB: ', err);
    await sendDiscordLog(`Failed to connect to MongoDB: ${err?.message || String(err)}`, 'ERROR');
    throw err;
  } finally {
    connectPromise = null;
  }
}
