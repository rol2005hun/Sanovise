import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { connectDB } from '../utils/db';
import { sendDiscordLog } from '../utils/discordLogger';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

connectDB().catch(err => {
    console.error('[Sanovise - Error] DB connection failed in auth router: ', err);
});

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, userData, language, favoriteModel } = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, error: 'email and password are required' });
            return;
        }

        const existing = await User.findOne({ email }).exec();
        if (existing) {
            res.status(409).json({ success: false, error: 'User with this email already exists' });
            return;
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

        sendDiscordLog(`[Auth] New user registered: ${email}`, 'INFO');

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({ success: true, token, user: { id: user._id, email: user.email } });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /register error: ', err);
        next(err);
    }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) { res.status(400).json({ success: false, error: 'email and password required' }); return; }

        const user = await User.findOne({ email }).exec();
        if (!user) { res.status(401).json({ success: false, error: 'Invalid credentials' }); return; }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) { res.status(401).json({ success: false, error: 'Invalid credentials' }); return; }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        sendDiscordLog(`[Auth] User logged in: ${email}`, 'INFO');
        res.json({ success: true, token, user: { id: user._id, email: user.email } });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /login error: ', err);
        next(err);
    }
});

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;
    const authHeader = req.headers.authorization as string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        const cookieHeader = req.headers.cookie as string | undefined;
        if (cookieHeader) {
            const parts = cookieHeader.split(';').map(p => p.trim());
            const found = parts.find(p => p.startsWith('sanovise_token='));
            if (found) {
                const val = found.split('=')[1];
                try { token = decodeURIComponent(val || '') } catch (e) { token = val }
            }
        }
    }

    if (!token) {
        res.clearCookie && res.clearCookie('sanovise_token', { path: '/' });
        res.status(401).json({ success: false, error: 'Missing token' });
        return;
    }

    try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        (req as any).user = { id: payload.id, email: payload.email };
        next();
    } catch (err) {
        res.clearCookie && res.clearCookie('sanovise_token', { path: '/' });
        res.status(401).json({ success: false, error: 'Invalid token' });
        return;
    }
};

export { authMiddleware };

router.get('/me', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let uid: string | undefined = (req as any).user?.id;

        if (!uid) {
            let token: string | undefined;
            const authHeader = req.headers.authorization as string | undefined;
            if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];

            if (!token) {
                const cookieHeader = req.headers.cookie as string | undefined;
                if (cookieHeader) {
                    const parts = cookieHeader.split(';').map(p => p.trim());
                    const found = parts.find(p => p.startsWith('sanovise_token='));
                    if (found) {
                        const val = found.split('=')[1];
                        try { token = decodeURIComponent(val || '') } catch (e) { token = val }
                    }
                }
            }

            if (!token) {
                try { res.clearCookie && res.clearCookie('sanovise_token', { path: '/' }) } catch (e) { }
                res.status(401).json({ success: false, error: 'Missing token' });
                return;
            }

            try {
                const payload: any = jwt.verify(token, JWT_SECRET);
                uid = payload.id;
            } catch (e) {
                try { res.clearCookie && res.clearCookie('sanovise_token', { path: '/' }) } catch (er) { }
                res.status(401).json({ success: false, error: 'Invalid token' });
                return;
            }
        }

        const user = await User.findById(uid).select('-passwordHash').exec();
        if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }
        res.json({ success: true, user });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /me error: ', err);
        next(err);
    }
});

router.post('/update', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const uid = (req as any).user.id;
        const { language, favoriteModel, userData, password } = req.body;

        const update: any = {};
        if (language) update.language = language;
        if (favoriteModel) update.favoriteModel = favoriteModel;
        if (userData) update.userData = userData;
        if (password) {
            update.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        }

        const user = await User.findByIdAndUpdate(uid, { $set: update }, { new: true }).select('-passwordHash').exec();
        if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }

        sendDiscordLog(`[Auth] User updated: ${user.email}`, 'INFO');
        res.json({ success: true, user });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /update error: ', err);
        next(err);
    }
});

router.delete('/delete', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const uid = (req as any).user.id;
        const user = await User.findByIdAndDelete(uid).exec();
        if (!user) { res.status(404).json({ success: false, error: 'User not found' }); return; }

        sendDiscordLog(`[Auth] User deleted: ${user.email}`, 'WARNING');

        try { res.clearCookie && res.clearCookie('sanovise_token', { path: '/' }) } catch (e) { }

        res.json({ success: true });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /delete error: ', err);
        next(err);
    }
});

export default router;