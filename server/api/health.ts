import express, { Request, Response, NextFunction } from 'express';
import HealthEntry from '../models/HealthEntry';
import { connectDB } from '../utils/db';
import { authMiddleware } from './auth';
import { sendDiscordLog } from '../utils/discordLogger';

const router = express.Router();

connectDB().catch(err => {
    console.error('[Sanovise - Error] DB connection failed in health router: ', err);
});

router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = (req as any).user.id;
        const { date, pulse, systolic, diastolic, steps, notes } = req.body;
        if (!date) {
            res.status(400).json({ success: false, error: 'date is required' });
            return;
        }

        let entry = await HealthEntry.findOne({ userId: uid, date }).exec();
        if (entry) {
            entry.pulse = typeof pulse === 'number' ? pulse : entry.pulse;
            entry.systolic = typeof systolic === 'number' ? systolic : entry.systolic;
            entry.diastolic = typeof diastolic === 'number' ? diastolic : entry.diastolic;
            entry.steps = typeof steps === 'number' ? steps : entry.steps;
            entry.notes = notes ?? entry.notes;
            await entry.save();
            res.json({ success: true, entry });
            return;
        }

        entry = new HealthEntry({ userId: uid, date, pulse: pulse ?? null, systolic: systolic ?? null, diastolic: diastolic ?? null, steps: steps ?? null, notes: notes ?? '' });
        await entry.save();

        sendDiscordLog(`[Health] New entry saved for user ${uid} date ${date}`, 'INFO');

        res.status(201).json({ success: true, entry });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /health POST error: ', err);
        next(err);
    }
});

router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = (req as any).user.id;
        const entries = await HealthEntry.find({ userId: uid }).sort({ date: -1 }).limit(1000).exec();
        res.json({ success: true, entries });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /health GET error: ', err);
        next(err);
    }
});

router.delete('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid = (req as any).user.id;
        const date = (req.query.date as string) || req.body && req.body.date;
        if (!date) {
            res.status(400).json({ success: false, error: 'date is required' });
            return;
        }

        const entry = await HealthEntry.findOneAndDelete({ userId: uid, date }).exec();
        if (!entry) {
            res.status(404).json({ success: false, error: 'Entry not found' });
            return;
        }

        sendDiscordLog(`[Health] Entry deleted for user ${uid} date ${date}`, 'WARNING');

        res.json({ success: true });
        return;
    } catch (err: any) {
        console.error('[Sanovise - Error] /health DELETE error: ', err);
        next(err);
    }
});

export default router;