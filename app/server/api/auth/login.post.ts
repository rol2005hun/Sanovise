import bcrypt from 'bcrypt';
import { createError, readBody, setResponseStatus } from 'h3';
import User from '../../models/User';
import { connectDB } from '../../utils/db';
import { sendDiscordLog } from '../../utils/discordLogger';
import { signToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { email, password } = await readBody(event) as any;

    if (!email || !password) {
      setResponseStatus(event, 400);
      return { success: false, error: 'email and password required' };
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Invalid credentials' };
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Invalid credentials' };
    }

    const token = signToken({ id: user._id.toString(), email: user.email });
    await sendDiscordLog(`[Auth] User logged in: ${email}`, 'INFO');

    return { success: true, token, user: { id: user._id, email: user.email } };
  } catch (err: any) {
    console.error('[Sanovise - Error] /login error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Login failed' });
  }
});
