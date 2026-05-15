import { createError, setResponseStatus } from 'h3';
import User from '../../models/User';
import { connectDB } from '../../utils/db';
import { requireUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { id } = requireUser(event);

    const user = await User.findById(id).select('-passwordHash').exec();
    if (!user) {
      setResponseStatus(event, 404);
      return { success: false, error: 'User not found' };
    }

    return { success: true, user };
  } catch (err: any) {
    if (err?.statusCode) {
      setResponseStatus(event, err.statusCode);
      return { success: false, error: err.statusMessage };
    }

    console.error('[Sanovise - Error] /me error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Failed to fetch profile' });
  }
});
