<template>
    <div class="health-dashboard card">
        <h3>{{ $t('health.dashboard.title') }}</h3>

        <div class="summary">
            <div class="stat">
                <div class="label">{{ $t('health.dashboard.avgPulse') }}</div>
                <div class="value">{{ healthStore.averagePulse ?? '-' }}</div>
            </div>
            <div class="stat">
                <div class="label">{{ $t('health.dashboard.avgBP') }}</div>
                <div class="value">{{ healthStore.averageSystolic ?? '-' }}/{{ healthStore.averageDiastolic ?? '-' }}
                </div>
            </div>
            <div class="stat">
                <div class="label">{{ $t('health.dashboard.totalSteps') }}</div>
                <div class="value">{{ healthStore.totalSteps }}</div>
            </div>
        </div>

        <!-- Charts: 30-day pulse and steps -->
        <div class="charts">
            <div class="chart">
                <h4>{{ $t('health.dashboard.pulseChart') }}</h4>
                <div class="chart-inner">
                    <div class="left-axis">
                        <div class="axis-max">{{ pulseMax ?? '-' }}</div>
                        <div class="axis-min">0</div>
                    </div>
                    <div class="spark">
                        <svg viewBox="0 0 300 60" @mousemove="onPulseMove" @mouseleave="hideTooltip">
                            <polyline v-if="pulsePoints" :points="pulsePoints" fill="none" stroke="#ff4d4f"
                                stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
                            <rect v-else x="0" y="0" width="300" height="60" fill="transparent" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="chart">
                <h4>{{ $t('health.dashboard.stepsChart') }}</h4>
                <div class="chart-inner">
                    <div class="left-axis">
                        <div class="axis-max">{{ stepsMax ?? '-' }}</div>
                        <div class="axis-min">0</div>
                    </div>
                    <div class="spark">
                        <svg viewBox="0 0 300 60" @mousemove="onStepsMove" @mouseleave="hideTooltip">
                            <polyline v-if="stepsPoints" :points="stepsPoints" fill="none" stroke="#4caf50"
                                stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
                            <rect v-else x="0" y="0" width="300" height="60" fill="transparent" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Single card: selected-day table with daily vs 30-day average evaluations -->
        <div class="selected-entry single-card">
            <h4>{{ $t('health.dashboard.selectedTitle') }}: {{ selectedDate }}</h4>

            <div v-if="!selectedEntry">
                <em>{{ $t('health.dashboard.noSelected') }}</em>
            </div>

            <div v-else>
                <table class="metrics-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>{{ $t('health.dashboard.daily') }}</th>
                            <th>{{ $t('health.dashboard.averageWithDays', { days }) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ $t('health.form.pulse') }}</td>
                            <td>
                                <div class="metric-value">{{ selectedEntry.pulse ?? '-' }}</div>
                                <div class="metric-eval" :class="dailyPulseCategory?.severity">{{
                                    dailyPulseCategory?.message ?? '' }}</div>
                            </td>
                            <td>
                                <div class="metric-value">{{ avgMetrics.pulse ?? '-' }}</div>
                                <div class="metric-eval" :class="avgPulseCategory?.severity">{{
                                    avgPulseCategory?.message ?? '' }}</div>
                            </td>
                        </tr>

                        <tr>
                            <td>{{ $t('health.form.systolic') }} / {{ $t('health.form.diastolic') }}</td>
                            <td>
                                <div class="metric-value">{{ selectedEntry.systolic ?? '-' }}/{{ selectedEntry.diastolic
                                    ?? '-' }}</div>
                                <div class="metric-eval" :class="dailyBPCategory?.severity">{{ dailyBPCategory?.message
                                    ?? '' }}</div>
                            </td>
                            <td>
                                <div class="metric-value">{{ avgMetrics.systolic ?? '-' }}/{{ avgMetrics.diastolic ??
                                    '-' }}</div>
                                <div class="metric-eval" :class="avgBPCategory?.severity">{{ avgBPCategory?.message ??
                                    '' }}</div>
                            </td>
                        </tr>

                        <tr>
                            <td>{{ $t('health.form.steps') }}</td>
                            <td>
                                <div class="metric-value">{{ selectedEntry.steps ?? '-' }}</div>
                                <div class="metric-eval" :class="dailyStepsCategory?.severity">{{
                                    dailyStepsCategory?.message ?? '' }}</div>
                            </td>
                            <td>
                                <div class="metric-value">{{ avgMetrics.steps ?? '-' }}</div>
                                <div class="metric-eval" :class="avgStepsCategory?.severity">{{
                                    avgStepsCategory?.message ?? '' }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="notes"><strong>{{ $t('health.form.notes') }}:</strong> {{ selectedEntry.notes ?? '' }}</div>

                <div class="scores">
                    <div class="daily-score">{{ $t('health.dashboard.dailyScore') }}: {{ dailyScore ?? '-' }}</div>
                    <div class="avg-score">{{ $t('health.dashboard.avgScore') }}: {{
                        $t('health.dashboard.averageWithDays', { days }) }}: {{ avgScore ?? '-' }}</div>
                </div>
            </div>
        </div>

        <div v-if="tooltip.visible" class="chart-tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">{{
            tooltip.text }}</div>
    </div>
</template>

<script setup lang="ts">
import { useHealth } from '@/store/modules/health';
import { useHealthLog } from '@/composables/useHealthLog';
import { evaluateHealthEntry, type HealthEvaluation } from '@/utils/healthEvaluator';

const healthStore = useHealth();
const { summary, evaluateLatest, evaluateForDate, averageScore, store } = useHealthLog();
const days = 30;
const data = computed(() => summary(days));

const pulsePoints = computed(() => {
    const arr = data.value;
    if (!arr || arr.length === 0) return null;
    const hasPulse = arr.some(d => typeof d.pulse === 'number');
    if (!hasPulse) return null;

    const pts: string[] = [];
    const max = Math.max(...arr.map(d => d.pulse ?? 0), 100);

    arr.forEach((d, i) => {
        const x = Math.round((i / (arr.length - 1 || 1)) * 300);
        const y = 60 - ((d.pulse ?? 0) / (max || 1)) * 50;
        pts.push(`${x},${y}`);
    });

    return pts.join(' ');
})


const stepsPoints = computed(() => {
    const arr = data.value;
    if (!arr || arr.length === 0) return null;
    const hasSteps = arr.some(d => typeof d.steps === 'number' && (d.steps ?? 0) > 0);
    if (!hasSteps) return null;

    const pts: string[] = [];
    const max = Math.max(...arr.map(d => d.steps ?? 0), 10);
    const padTop = 5;
    const padBottom = 5;
    const height = 60;
    const usable = height - padTop - padBottom;

    arr.forEach((d, i) => {
        const x = Math.round((i / (arr.length - 1 || 1)) * 300);
        const normalized = (d.steps ?? 0) / (max || 1);
        const y = padTop + (1 - normalized) * usable;
        pts.push(`${x},${Math.round(y)}`);
    });

    return pts.join(' ');
})

const evaluation = computed(() => evaluateLatest());

const selectedEntry = computed(() => store.entryForSelectedDate ?? store.entries.find(e => e.date === store.selectedDate) ?? null);

const selectedDate = computed(() => store.selectedDate);

const dailyEvaluation = computed(() => {
    if (!selectedDate.value) return null;
    return evaluateForDate ? evaluateForDate(selectedDate.value) : null;
});

const dailyScore = computed(() => dailyEvaluation.value ? dailyEvaluation.value.score : null);

const avgScore = computed(() => {
    return averageScore ? averageScore(30) : null;
});

const avgMetrics = computed(() => {
    const arr = store.aggregatedByDay(30);
    if (!arr || !arr.length) return { pulse: null, systolic: null, diastolic: null, steps: null };
    const pulses = arr.map(d => d.pulse).filter((v): v is number => typeof v === 'number');
    const systolics = arr.map(d => d.systolic).filter((v): v is number => typeof v === 'number');
    const diastolics = arr.map(d => d.diastolic).filter((v): v is number => typeof v === 'number');
    const steps = arr.map(d => d.steps ?? 0);
    const avg = (vals: number[]) => vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : null;
    return {
        pulse: avg(pulses),
        systolic: avg(systolics),
        diastolic: avg(diastolics),
        steps: avg(steps)
    }
});

type Category = { title: string; severity: 'ok' | 'notice' | 'warning' | 'danger'; message: string } | null;

function findCategory(ev: HealthEvaluation | null, title: string): Category {
    if (!ev) return null;
    return ev.categories.find(c => c.title.toLowerCase().includes(title.toLowerCase())) ?? null;
}

const dailyPulseCategory = computed<Category | null>(() => findCategory(dailyEvaluation.value, 'Pulse'));
const dailyBPCategory = computed<Category | null>(() => findCategory(dailyEvaluation.value, 'Blood'));
const dailyStepsCategory = computed<Category | null>(() => findCategory(dailyEvaluation.value, 'Activity'));

const avgPulseCategory = computed<Category | null>(() => {
    const avg = avgMetrics.value;
    if (!avg || typeof avg.pulse !== 'number') return null;
    const ev = evaluateHealthEntry({ pulse: avg.pulse, systolic: avg.systolic ?? null, diastolic: avg.diastolic ?? null, steps: avg.steps ?? null, age: null });
    return findCategory(ev, 'Pulse');
});

const avgBPCategory = computed<Category | null>(() => {
    const avg = avgMetrics.value;
    if (!avg || typeof avg.systolic !== 'number' || typeof avg.diastolic !== 'number') return null;
    const ev = evaluateHealthEntry({ pulse: null, systolic: avg.systolic, diastolic: avg.diastolic, steps: avg.steps ?? null, age: null });
    return findCategory(ev, 'Blood');
});

const avgStepsCategory = computed<Category | null>(() => {
    const avg = avgMetrics.value;
    if (!avg || typeof avg.steps !== 'number') return null;
    const ev = evaluateHealthEntry({ pulse: null, systolic: null, diastolic: null, steps: avg.steps, age: null });
    return findCategory(ev, 'Activity');
});

const pulseValues = computed(() => (data.value || []).map(d => typeof d.pulse === 'number' ? d.pulse : null));
const stepsValues = computed(() => (data.value || []).map(d => typeof d.steps === 'number' ? d.steps : 0));

const pulseMax = computed(() => {
    const vals = pulseValues.value.filter((v): v is number => typeof v === 'number');
    return vals.length ? Math.max(...vals) : null;
});

const stepsMax = computed(() => {
    const vals = stepsValues.value.filter((v): v is number => typeof v === 'number');
    return vals.length ? Math.max(...vals) : null;
});

const pulseTitle = ref<string | null>(null);
const stepsTitle = ref<string | null>(null);

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

function onPulseMove(ev: MouseEvent) {
    const svg = ev.currentTarget as SVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ev.clientX - rect.left;
    const len = data.value.length || 1;
    const idx = clamp(Math.round((relX / rect.width) * (len - 1)), 0, len - 1);
    const d = data.value[idx];
    const val = pulseValues.value[idx];
    if (!d) { hideTooltip(); return; }
    const txt = (val === null || val === undefined) ? `${d.date}: —` : `${d.date}: ${val} bpm`;
    showTooltip(txt, ev.clientX, ev.clientY);
}

function onStepsMove(ev: MouseEvent) {
    const svg = ev.currentTarget as SVGElement | null;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ev.clientX - rect.left;
    const len = data.value.length || 1;
    const idx = clamp(Math.round((relX / rect.width) * (len - 1)), 0, len - 1);
    const d = data.value[idx];
    const val = stepsValues.value[idx];
    if (!d) { hideTooltip(); return; }
    const txt = (val === null || val === undefined) ? `${d.date}: —` : `${d.date}: ${val} lépés`;
    showTooltip(txt, ev.clientX, ev.clientY);
}

const tooltip = ref<{ visible: boolean, x: number, y: number, text: string }>({ visible: false, x: 0, y: 0, text: '' });

function showTooltip(text: string, x: number, y: number) {
    tooltip.value = { visible: true, x: x + 12, y: y + 12, text };
}

function hideTooltip() {
    tooltip.value.visible = false;
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/healthdashboard';
</style>