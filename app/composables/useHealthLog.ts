import { useHealth } from '../store/modules/health'
import { dataStore } from '@/store'
import { evaluateHealthEntry, type HealthEvaluation } from '../utils/healthEvaluator'

export function useHealthLog() {
    const store = useHealth();

    function add(entry: { date?: string, pulse?: number | null, systolic?: number | null, diastolic?: number | null, steps?: number | null, notes?: string }) {
        const e = store.addEntry(entry);

        try {
            if (dataStore.isLoggedIn) {
                const apiUrl = 'http://138.68.77.184:6969/api/health';
                (async () => {
                    try {
                        let headers: any = { 'Content-Type': 'application/json' };
                        try {
                            const tokenCookie = useCookie && typeof useCookie === 'function' ? useCookie('sanovise_token') : null;
                            const token = tokenCookie ? tokenCookie.value : null;
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                        } catch (e) {
                            console.error(e);
                        }

                        await fetch(apiUrl, {
                            method: 'POST',
                            credentials: 'include',
                            headers,
                            body: JSON.stringify(e)
                        });
                    } catch (err) {
                        console.warn('[useHealthLog] Failed to POST health entry to server', err);
                    }
                })();
            }
        } catch (err) {
            console.warn('[useHealthLog] Error while attempting server save', err);
        }

        return e;
    }

    function list() {
        return store.allEntries;
    }

    async function del(date: string) {
        const existing = store.entries.find(e => e.date === date);
        if (existing) store.removeEntry(existing.id);

        try {
            if (dataStore.isLoggedIn) {
                const apiUrl = `http://138.68.77.184:6969/api/health?date=${encodeURIComponent(date)}`;
                let headers: any = { 'Content-Type': 'application/json' };
                try {
                    const tokenCookie = useCookie && typeof useCookie === 'function' ? useCookie('sanovise_token') : null;
                    const token = tokenCookie ? tokenCookie.value : null;
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                } catch (e) {
                    console.error(e);
                }

                await fetch(apiUrl, { method: 'DELETE', credentials: 'include', headers });
            }
        } catch (err) {
            console.warn('[useHealthLog] Failed to DELETE health entry on server', err);
        }
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

    return { add, list, summary, evaluateLatest, evaluateForDate, averageScore, store, del };
}