export type HealthEvaluation = {
    score: number;
    categories: { title: string, severity: 'ok' | 'notice' | 'warning' | 'danger', message: string }[];
}

export function evaluateHealthEntry(entry: { pulse?: number | null, systolic?: number | null, diastolic?: number | null, steps?: number | null, age?: number | null }): HealthEvaluation {
    const categories: HealthEvaluation['categories'] = [];
    let score = 100;
    const pulse = entry.pulse ?? null;
    if (pulse) {
        const lowBoundary = 60;
        const highBoundary = 80;
        if (pulse >= lowBoundary && pulse <= highBoundary) {
            categories.push({ title: 'Pulse', severity: 'ok', message: 'health.evaluation.pulse.ok' });
        } else {
            const distance = pulse < lowBoundary ? (lowBoundary - pulse) : (pulse - highBoundary);
            const penalty = Math.min(Math.round(distance * 0.5), 25);
            categories.push({ title: 'Pulse', severity: 'warning', message: pulse < lowBoundary ? 'health.evaluation.pulse.low' : 'health.evaluation.pulse.high' });
            score -= penalty;
        }
    }

    const s = entry.systolic ?? null;
    const d = entry.diastolic ?? null;
    if (s && d) {
        const sysNormalLow = 110;
        const sysNormalHigh = 130;
        const diaNormalLow = 70;
        const diaNormalHigh = 85;

        const sysPenalty = s < sysNormalLow ? (sysNormalLow - s) * 0.3 : (s > sysNormalHigh ? (s - sysNormalHigh) * 0.4 : 0);
        const diaPenalty = d < diaNormalLow ? (diaNormalLow - d) * 0.3 : (d > diaNormalHigh ? (d - diaNormalHigh) * 0.5 : 0);
        const combinedPenalty = Math.round(Math.min(sysPenalty + diaPenalty, 60));

        if (s >= 180 || d >= 120) {
            categories.push({ title: 'Blood pressure', severity: 'danger', message: 'health.evaluation.bp.danger' });
            score -= Math.max(combinedPenalty, 40);
        } else if (s >= 140 || d >= 90) {
            categories.push({ title: 'Blood pressure', severity: 'warning', message: 'health.evaluation.bp.high' });
            score -= Math.max(combinedPenalty, 15);
        } else if (s < 90 || d < 60) {
            categories.push({ title: 'Blood pressure', severity: 'notice', message: 'health.evaluation.bp.low' });
            score -= Math.max(combinedPenalty, 8);
        } else {
            categories.push({ title: 'Blood pressure', severity: 'ok', message: 'health.evaluation.bp.ok' });
            const smallBonus = Math.round(Math.max(0, (sysNormalHigh - s) * 0.05 + (diaNormalHigh - d) * 0.05));
            score = Math.min(100, score + smallBonus);
        }
    }

    const steps = entry.steps ?? 0
    if (steps <= 0) {
        categories.push({ title: 'Activity', severity: 'notice', message: 'health.evaluation.activity.low' });
        score -= 8;
    } else if (steps < 1000) {
        categories.push({ title: 'Activity', severity: 'notice', message: 'health.evaluation.activity.low' });
        const pct = 1 - (steps / 1000);
        score -= Math.round(pct * 8);
    } else {
        if (steps >= 10000) {
            categories.push({ title: 'Activity', severity: 'ok', message: 'health.evaluation.activity.good' });
            const bonus = Math.round(Math.min((steps - 10000) / 10000 * 6, 6));
            score = Math.min(100, score + bonus);
        } else {
            categories.push({ title: 'Activity', severity: 'ok', message: 'health.evaluation.activity.ok' });
            const bonus = Math.round((steps - 1000) / 9000 * 2);
            if (bonus > 0) score = Math.min(100, score + bonus);
        }
    };

    const age = entry.age ?? null
    if (age && age > 65 && (pulse && pulse > 95)) { categories.push({ title: 'Age', severity: 'warning', message: 'health.evaluation.age.highPulse' }); score -= 5 };

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return { score, categories };
}