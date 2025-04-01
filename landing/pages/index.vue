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
      <div class="feature-card" v-for="index in 3" :key="index">
        <h3>{{ $t(`pages.index.features.titles[${index - 1}]`) }}</h3>
        <p>{{ $t(`pages.index.features.descriptions[${index - 1}]`) }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/index.scss';
</style>