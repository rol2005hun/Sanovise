import bcrypt from 'bcryptjs';
import { createError, readBody, setResponseStatus } from 'h3';
import User from '../../models/User';
import { connectDB } from '../../utils/db';
import { sendDiscordLog } from '../../utils/discordLogger';
import { signToken } from '../../utils/auth';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { email, password, userData, language, favoriteModel } = await readBody(event) as any;

    if (!email || !password) {
      setResponseStatus(event, 400);
      return { success: false, error: 'email and password are required' };
    }

    const existing = await User.findOne({ email }).exec();
    if (existing) {
      setResponseStatus(event, 409);
      return { success: false, error: 'User with this email already exists' };
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      email,
      passwordHash,
      language: language || (userData && userData.language) || 'en',
      favoriteModel: favoriteModel || (userData && userData.selectedModel && userData.selectedModel.id) || 'deepseek/deepseek-r1:free',
      userData: userData || {}
    });

    await user.save();
    await sendDiscordLog(`[Auth] New user registered: ${email}`, 'INFO');

    const token = signToken({ id: user._id.toString(), email: user.email });
    setResponseStatus(event, 201);

    return { success: true, token, user: { id: user._id, email: user.email } };
  } catch (err: any) {
    console.error('[Sanovise - Error] /register error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Registration failed' });
  }
});
