import { defineStore } from 'pinia';

export type HealthEntry = {
    id: string;
    date: string;
    pulse?: number | null;
    systolic?: number | null;
    diastolic?: number | null;
    steps?: number | null;
    notes?: string;
}

const STORAGE_KEY = 'sanovise_health_entries_v1';

function readLocal(): HealthEntry[] {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return [];
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as HealthEntry[];
    } catch (e) {
        console.error('Failed to read health entries from localStorage', e);
        return [];
    }
}

function writeLocal(entries: HealthEntry[]) {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
        console.error('Failed to write health entries to localStorage', e);
    }
}

function genId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useHealth = defineStore('health', {
    state: () => ({
        entries: [] as HealthEntry[],
        selectedDate: new Date().toISOString().slice(0, 10),
    }),

    getters: {
        allEntries: (state) => state.entries.slice().sort((a, b) => a.date < b.date ? 1 : -1),
        latest: (state) => state.entries.slice().sort((a, b) => a.date < b.date ? 1 : -1)[0] ?? null,
        entryForSelectedDate: (state) => state.entries.find(e => e.date === state.selectedDate) ?? null,
        averagePulse: (state) => {
            const vals = state.entries.map(e => e.pulse).filter((v): v is number => typeof v === 'number');
            if (!vals.length) return null;
            return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
        },
        averageSystolic: (state) => {
            const vals = state.entries.map(e => e.systolic).filter((v): v is number => typeof v === 'number');
            if (!vals.length) return null;
            return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
        },
        averageDiastolic: (state) => {
            const vals = state.entries.map(e => e.diastolic).filter((v): v is number => typeof v === 'number');
            if (!vals.length) return null;
            return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
        },
        totalSteps: (state) => state.entries.map(e => e.steps ?? 0).reduce((s, v) => s + v, 0),
    },

    actions: {
        async init() {
            try {
                if (typeof window !== 'undefined') {
                    try {
                        const headers: any = {};
                        try {
                            const tokenCookie = typeof useCookie === 'function' ? useCookie('sanovise_token') : null;
                            const token = tokenCookie ? tokenCookie.value : null;
                            if (token) headers['Authorization'] = `Bearer ${token}`;
                        } catch (e) {
                            console.log(e);
                        }

                        const res = await fetch('http://138.68.77.184:6969/api/health', { credentials: 'include', headers });
                        if (res.ok) {
                            const body = await res.json();
                            if (body && body.success && Array.isArray(body.entries)) {
                                const mapped = body.entries.map((e: any) => ({
                                    id: e._id?.toString() ?? e.id ?? genId(),
                                    date: e.date,
                                    pulse: typeof e.pulse === 'number' ? e.pulse : null,
                                    systolic: typeof e.systolic === 'number' ? e.systolic : null,
                                    diastolic: typeof e.diastolic === 'number' ? e.diastolic : null,
                                    steps: typeof e.steps === 'number' ? e.steps : null,
                                    notes: e.notes ?? ''
                                } as any));

                                const local = readLocal();
                                const serverByDate = new Map<string, any>();
                                for (const s of mapped) serverByDate.set(s.date, s);

                                for (const l of local) {
                                    if (!serverByDate.has(l.date)) {
                                        serverByDate.set(l.date, l);
                                    }
                                }

                                const merged = Array.from(serverByDate.values()).sort((a: any, b: any) => a.date < b.date ? 1 : -1);
                                this.entries = merged;

                                this.save();
                                return;
                            }
                        }
                    } catch (err) {
                        console.warn('[Sanovise] Failed to load health entries from server, falling back to localStorage', err);
                    }
                }

                this.entries = readLocal();
            } catch (e) {
                console.error(e);
            }
        },

        save() {
            try {
                writeLocal(this.entries);
            } catch (e) {
                console.error(e);
            }
        },

        addEntry(partial: Omit<Partial<HealthEntry>, 'id'> & { date?: string }) {
            const date = (partial.date ?? new Date().toISOString()).slice(0, 10);
            const existing = this.entries.find(e => e.date === date);
            if (existing) {
                existing.pulse = typeof partial.pulse === 'number' ? partial.pulse : existing.pulse;
                existing.systolic = typeof partial.systolic === 'number' ? partial.systolic : existing.systolic;
                existing.diastolic = typeof partial.diastolic === 'number' ? partial.diastolic : existing.diastolic;
                existing.steps = typeof partial.steps === 'number' ? partial.steps : existing.steps;
                existing.notes = partial.notes ?? existing.notes ?? '';
                this.save();
                return existing;
            }

            const entry: HealthEntry = {
                id: genId(),
                date,
                pulse: typeof partial.pulse === 'number' ? partial.pulse : null,
                systolic: typeof partial.systolic === 'number' ? partial.systolic : null,
                diastolic: typeof partial.diastolic === 'number' ? partial.diastolic : null,
                steps: typeof partial.steps === 'number' ? partial.steps : null,
                notes: partial.notes ?? ''
            }
            this.entries.push(entry);
            this.save();
            return entry;
        },

        selectDate(date: string) {
            this.selectedDate = date;
        },

        removeEntry(id: string) {
            this.entries = this.entries.filter(e => e.id !== id);
            this.save();
        },

        clearAll() {
            this.entries = [];
            this.save();
        },

        aggregatedByDay(days = 30) {
            const map = new Map<string, { date: string, pulse: number | null, systolic: number | null, diastolic: number | null, steps: number }>();
            const today = new Date();
            for (let i = 0; i < days; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - (days - 1 - i));
                const key = d.toISOString().slice(0, 10);
                map.set(key, { date: key, pulse: null, systolic: null, diastolic: null, steps: 0 });
            }

            for (const e of this.entries) {
                if (!map.has(e.date)) continue;
                const agg = map.get(e.date)!;
                if (typeof e.pulse === 'number') agg.pulse = e.pulse;
                if (typeof e.systolic === 'number') agg.systolic = e.systolic;
                if (typeof e.diastolic === 'number') agg.diastolic = e.diastolic;
                agg.steps += e.steps ?? 0;
            }

            return Array.from(map.values());
        }
    }
});