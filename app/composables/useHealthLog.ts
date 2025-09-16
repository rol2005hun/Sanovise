import { useHealth } from '../store/modules/health'
import { evaluateHealthEntry, type HealthEvaluation } from '../utils/healthEvaluator'

export function useHealthLog() {
    const store = useHealth();
    store.init();

    function add(entry: { date?: string, pulse?: number | null, systolic?: number | null, diastolic?: number | null, steps?: number | null, notes?: string }) {
        const e = store.addEntry(entry);
        return e;
    }

    function list() {
        return store.allEntries;
    }

    function summary(days = 30) {
        return store.aggregatedByDay(days);
    }

    function evaluateLatest(age?: number | null): HealthEvaluation | null {
        const latest = store.latest;
        if (!latest) return null;
        return evaluateHealthEntry({ pulse: latest.pulse ?? null, systolic: latest.systolic ?? null, diastolic: latest.diastolic ?? null, steps: latest.steps ?? null, age: age ?? null });
    }

    function evaluateForDate(date: string, age?: number | null): HealthEvaluation | null {
        const entry = store.entries.find(e => e.date === date) ?? null;
        if (!entry) return null;
        return evaluateHealthEntry({ pulse: entry.pulse ?? null, systolic: entry.systolic ?? null, diastolic: entry.diastolic ?? null, steps: entry.steps ?? null, age: age ?? null });
    }

    function averageScore(days = 30, age?: number | null): number | null {
        const arr = store.aggregatedByDay(days);
        if (!arr.length) return null;
        const scores: number[] = [];
        for (const d of arr) {
            const ev = evaluateHealthEntry({ pulse: d.pulse ?? null, systolic: d.systolic ?? null, diastolic: d.diastolic ?? null, steps: d.steps ?? 0, age: age ?? null });
            scores.push(ev.score);
        }
        if (!scores.length) return null;
        const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
        return avg;
    }

    return { add, list, summary, evaluateLatest, evaluateForDate, averageScore, store };
}