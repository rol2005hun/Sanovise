<template>
  <video autoplay muted loop class="video">
    <source src="https://cdn.pixabay.com/video/2016/09/21/5458-183788605_medium.mp4" type="video/mp4">
    Your browser does not support HTML5 video.
  </video>
  <div class="app-container">
    <Header />
    <main class="main-container">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@use '@/assets/styles/layouts/default.scss';
</style>