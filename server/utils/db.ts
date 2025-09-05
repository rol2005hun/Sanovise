import mongoose from 'mongoose';
import { sendDiscordLog } from './discordLogger';

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        const msg = 'MONGODB_URI is not set in environment variables.';
        console.error('[Sanovise - Error] ' + msg);
        sendDiscordLog(msg, 'ERROR');
        throw new Error(msg);
    }

    try {
        await mongoose.connect(uri);
        console.log('[Sanovise - Info] Connected to MongoDB.');
        sendDiscordLog('Connected to MongoDB.', 'INFO');
    } catch (err: any) {
        console.error('[Sanovise - Error] Failed to connect to MongoDB: ', err);
        sendDiscordLog(`Failed to connect to MongoDB: ${err?.message || String(err)}`, 'ERROR');
        throw err;
    }
};