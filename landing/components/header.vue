<template>
  <header :class="['app-header', { 'scrolled': isScrolled }]">
    <div class="container header-content">
      <NuxtLink to="/" class="logo">{{ $t('components.header.home') }}</NuxtLink>
      <div class="menu-toggle" @click="toggleMenu">
        <div :class="['bar', { 'open': isOpen }]"></div>
        <div :class="['bar', { 'open': isOpen }]"></div>
        <div :class="['bar', { 'open': isOpen }]"></div>
      </div>
      <nav :class="['nav-menu', { 'open': isOpen, 'scrolled': isScrolled }]">
        <ul class="nav-list">
          <li>
            <NuxtLink to="/about" @click="closeMenu">{{ $t('components.header.about') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" @click="closeMenu">{{ $t('components.header.contact') }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const isScrolled = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/header.scss';
</style>