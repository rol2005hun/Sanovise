<template>
  <div class="container">
    <section class="hero">
      <div class="hero-content container">
        <h2>{{ $t('pages.index.heroTitle') }}</h2>
        <p>{{ $t('pages.index.heroDescription') }}</p>
        <a href="https://app.sanovise.ranzak.site/" class="btn-primary">{{ $t('pages.index.getStarted') }}</a>
      </div>
    </section>

    <section class="features container">
      <div class="feature-card" v-for="(feature, index) in features" :key="index">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const features = ref([
  { title: t('pages.index.features.analysis.title'), description: t('pages.index.features.analysis.description') },
  { title: t('pages.index.features.security.title'), description: t('pages.index.features.security.description') },
  { title: t('pages.index.features.multiPlatform.title'), description: t('pages.index.features.multiPlatform.description') },
]);
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/index.scss';
</style>