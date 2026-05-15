import HealthEntry from '../../models/HealthEntry';
import { connectDB } from '../../utils/db';
import { requireUser } from '../../utils/auth';
import { createError, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { id } = requireUser(event);
    const entries = await HealthEntry.find({ userId: id }).sort({ date: -1 }).limit(1000).exec();
    return { success: true, entries };
  } catch (err: any) {
    if (err?.statusCode) {
      setResponseStatus(event, err.statusCode);
      return { success: false, error: err.statusMessage };
    }

    console.error('[Sanovise - Error] /health GET error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Failed to fetch health entries' });
  }
});
