import { createError, readBody, setResponseStatus } from 'h3';
import HealthEntry from '../../models/HealthEntry';
import { connectDB } from '../../utils/db';
import { sendDiscordLog } from '../../utils/discordLogger';
import { requireUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { id } = requireUser(event);
    const { date, pulse, systolic, diastolic, steps, notes } = await readBody(event) as any;

    if (!date) {
      setResponseStatus(event, 400);
      return { success: false, error: 'date is required' };
    }

    let entry = await HealthEntry.findOne({ userId: id, date }).exec();
    if (entry) {
      entry.pulse = typeof pulse === 'number' ? pulse : entry.pulse;
      entry.systolic = typeof systolic === 'number' ? systolic : entry.systolic;
      entry.diastolic = typeof diastolic === 'number' ? diastolic : entry.diastolic;
      entry.steps = typeof steps === 'number' ? steps : entry.steps;
      entry.notes = notes ?? entry.notes;
      await entry.save();
      return { success: true, entry };
    }

    entry = new HealthEntry({
      userId: id,
      date,
      pulse: pulse ?? null,
      systolic: systolic ?? null,
      diastolic: diastolic ?? null,
      steps: steps ?? null,
      notes: notes ?? ''
    });

    await entry.save();
    await sendDiscordLog(`[Health] New entry saved for user ${id} date ${date}`, 'INFO');
    setResponseStatus(event, 201);

    return { success: true, entry };
  } catch (err: any) {
    if (err?.statusCode) {
      setResponseStatus(event, err.statusCode);
      return { success: false, error: err.statusMessage };
    }

    console.error('[Sanovise - Error] /health POST error: ', err);
    throw createError({ statusCode: 500, statusMessage: err?.message || 'Failed to save health entry' });
  }
});
