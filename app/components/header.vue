<template>
    <header class="header">
        <div class="logo">
            <img src="/logo.png" alt="App Logo" />
            <span>Sanovise</span>
        </div>
        <nav class="nav">
            <button @click="toggleSettings">⚙ Beállítások</button>
        </nav>
    </header>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/header.scss';
</style>