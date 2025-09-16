<template>
    <div class="page-health container">
        <h1>{{ $t('health.page.title') }}</h1>
        <div class="grid">
            <HealthLogForm />
            <HealthDashboard />
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/health';
</style>