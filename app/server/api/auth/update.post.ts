import bcrypt from 'bcryptjs';
import { createError, readBody, setResponseStatus } from 'h3';
import User from '../../models/User';
import { connectDB } from '../../utils/db';
import { sendDiscordLog } from '../../utils/discordLogger';
import { requireUser } from '../../utils/auth';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { id } = requireUser(event);
    const { language, favoriteModel, userData, password } = await readBody(event) as any;

    const update: any = {};
    if (language) update.language = language;
    if (favoriteModel) update.favoriteModel = favoriteModel;
    if (userData) update.userData = userData;
    if (password) update.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select('-passwordHash').exec();
    if (!user) {
      setResponseStatus(event, 404);
      return { success: false, error: 'User not found' };
    }

    await sendDiscordLog(`[Auth] User updated: ${user.email}`, 'INFO');
    return { success: true, user };
  } catch (err: any) {
    if (err?.statusCode) {
      setResponseStatus(event, err.statusCode);
      return { success: false, error: err.statusMessage };
    }

    console.error('[Sanovise - Error] /update error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Update failed' });
  }
});
