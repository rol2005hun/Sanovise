<template>
  <header class="app-header">
    <div class="container header-content">
      <NuxtLink to="/" class="logo">Főoldal</NuxtLink>
      <nav>
        <ul class="nav-list">
          <li>
            <NuxtLink to="/about">Rólunk</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact">Kapcsolat</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/header.scss';
</style>