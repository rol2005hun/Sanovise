export type HealthEvaluation = {
    score: number;
    categories: { title: string, severity: 'ok' | 'notice' | 'warning' | 'danger', message: string }[];
}

export function evaluateHealthEntry(entry: { pulse?: number | null, systolic?: number | null, diastolic?: number | null, steps?: number | null, age?: number | null }): HealthEvaluation {
    const categories: HealthEvaluation['categories'] = [];
    let score = 100;

    const pulse = entry.pulse ?? null;
    if (pulse) {
        if (pulse < 50) { categories.push({ title: 'Pulse', severity: 'warning', message: 'health.evaluation.pulse.low' }); score -= 15 }
        else if (pulse > 100) { categories.push({ title: 'Pulse', severity: 'warning', message: 'health.evaluation.pulse.high' }); score -= 15 }
        else { categories.push({ title: 'Pulse', severity: 'ok', message: 'health.evaluation.pulse.ok' }) };
    }

    const s = entry.systolic ?? null;
    const d = entry.diastolic ?? null;
    if (s && d) {
        if (s >= 180 || d >= 120) { categories.push({ title: 'Blood pressure', severity: 'danger', message: 'health.evaluation.bp.danger' }); score -= 40 }
        else if (s >= 140 || d >= 90) { categories.push({ title: 'Blood pressure', severity: 'warning', message: 'health.evaluation.bp.high' }); score -= 20 }
        else if (s < 90 || d < 60) { categories.push({ title: 'Blood pressure', severity: 'notice', message: 'health.evaluation.bp.low' }); score -= 10 }
        else { categories.push({ title: 'Blood pressure', severity: 'ok', message: 'health.evaluation.bp.ok' }) };
    }

    const steps = entry.steps ?? 0
    if (steps < 1000) { categories.push({ title: 'Activity', severity: 'notice', message: 'health.evaluation.activity.low' }); score -= 5 }
    else if (steps >= 10000) { categories.push({ title: 'Activity', severity: 'ok', message: 'health.evaluation.activity.good' }) }
    else { categories.push({ title: 'Activity', severity: 'ok', message: 'health.evaluation.activity.ok' }) };

    const age = entry.age ?? null
    if (age && age > 65 && (pulse && pulse > 95)) { categories.push({ title: 'Age', severity: 'warning', message: 'health.evaluation.age.highPulse' }); score -= 5 };

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return { score, categories };
}