<template>
  <div class="health-form card">
    <h3>{{ $t('health.form.title') }}</h3>
    <form @submit.prevent="onSubmit">
      <div class="row two-cols">
        <div class="field">
          <label>{{ $t('health.form.date') }}</label>
          <input type="date" v-model="date" placeholder="YYYY-MM-DD" />
        </div>
        <div class="field">
          <label>{{ $t('health.form.pulse') }} (bpm)</label>
          <input type="number" v-model.number="pulse" min="0" placeholder="72" />
        </div>
      </div>

      <div class="row two-cols">
        <div class="field">
          <label>{{ $t('health.form.systolic') }} (mmHg)</label>
          <input type="number" v-model.number="systolic" placeholder="120" min="0" />
        </div>
        <div class="field">
          <label>{{ $t('health.form.diastolic') }} (mmHg)</label>
          <input type="number" v-model.number="diastolic" placeholder="80" min="0" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>{{ $t('health.form.steps') }}</label>
          <input type="number" v-model.number="steps" min="0" placeholder="10000" />
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label>{{ $t('health.form.notes') }}</label>
          <input type="text" v-model="notes" placeholder="Egyéb megjegyzések..." />
        </div>
      </div>

      <div class="actions">
        <button type="submit">{{ $t('health.form.save') }}</button>
        <button type="button" @click="clear">{{ $t('health.form.clear') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useHealthLog } from '@/composables/useHealthLog';
const { add, store, del } = useHealthLog();

const date = ref(new Date().toISOString().slice(0, 10));
const pulse = ref<number | null>(null);
const systolic = ref<number | null>(null);
const diastolic = ref<number | null>(null);
const steps = ref<number | null>(null);
const notes = ref('');

function loadForDate(d: string) {
  const entry = store.entryForSelectedDate ?? store.entries.find(e => e.date === d) ?? null;
  if (entry) {
    pulse.value = entry.pulse ?? null;
    systolic.value = entry.systolic ?? null;
    diastolic.value = entry.diastolic ?? null;
    steps.value = entry.steps ?? null;
    notes.value = entry.notes ?? '';
  } else {
    pulse.value = null; systolic.value = null; diastolic.value = null; steps.value = null; notes.value = '';
  }
}

watch(date, (val) => {
  store.selectDate(val);
  loadForDate(val);
});

onMounted(async () => {
  try {
    if (store.init && typeof store.init === 'function') await store.init();
  } catch (err) {
    console.warn('[HealthLogForm] store.init failed', err);
  }
  store.selectDate(date.value);
  loadForDate(date.value);
});

function onSubmit() {
  add({ date: date.value, pulse: pulse.value, systolic: systolic.value, diastolic: diastolic.value, steps: steps.value, notes: notes.value });
  pulse.value = null; systolic.value = null; diastolic.value = null; steps.value = null; notes.value = '';
}

async function clear() {
  const existing = store.entries.find(e => e.date === date.value) ?? null;
  if (existing) {
    try {
      await del(date.value);
    } catch (err) {
      console.warn('[HealthLogForm] failed to delete entry', err);
    }
  }

  pulse.value = null; systolic.value = null; diastolic.value = null; steps.value = null; notes.value = '';
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/healthlogform';
</style>