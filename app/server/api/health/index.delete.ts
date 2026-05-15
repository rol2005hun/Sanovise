import { createError, getQuery, readBody, setResponseStatus } from 'h3';
import HealthEntry from '../../models/HealthEntry';
import { connectDB } from '../../utils/db';
import { sendDiscordLog } from '../../utils/discordLogger';
import { requireUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { id } = requireUser(event);

    const query = getQuery(event);
    const body = await readBody(event).catch(() => ({}));
    const date = (query.date as string) || body?.date;

    if (!date) {
      setResponseStatus(event, 400);
      return { success: false, error: 'date is required' };
    }

    const entry = await HealthEntry.findOneAndDelete({ userId: id, date }).exec();
    if (!entry) {
      setResponseStatus(event, 404);
      return { success: false, error: 'Entry not found' };
    }

    await sendDiscordLog(`[Health] Entry deleted for user ${id} date ${date}`, 'WARNING');
    return { success: true };
  } catch (err: any) {
    if (err?.statusCode) {
      setResponseStatus(event, err.statusCode);
      return { success: false, error: err.statusMessage };
    }

    console.error('[Sanovise - Error] /health DELETE error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Failed to delete health entry' });
  }
});
