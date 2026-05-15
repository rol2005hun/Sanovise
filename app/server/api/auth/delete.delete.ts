import { createError, deleteCookie, setResponseStatus } from 'h3';
import User from '../../models/User';
import { connectDB } from '../../utils/db';
import { sendDiscordLog } from '../../utils/discordLogger';
import { requireUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { id } = requireUser(event);

    const user = await User.findByIdAndDelete(id).exec();
    if (!user) {
      setResponseStatus(event, 404);
      return { success: false, error: 'User not found' };
    }

    await sendDiscordLog(`[Auth] User deleted: ${user.email}`, 'WARNING');
    deleteCookie(event, 'sanovise_token', { path: '/' });
    return { success: true };
  } catch (err: any) {
    if (err?.statusCode) {
      setResponseStatus(event, err.statusCode);
      return { success: false, error: err.statusMessage };
    }

    console.error('[Sanovise - Error] /delete error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Delete failed' });
  }
});
