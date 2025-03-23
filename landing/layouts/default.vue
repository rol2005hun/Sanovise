<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-container">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/header.vue';
import AppFooter from '@/components/footer.vue';
</script>

<style lang="scss">
@use '@/assets/styles/layouts/default.scss';
</style>