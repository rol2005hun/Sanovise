<template>
    <header class="header">
        <div class="logo" @click="resetAll()">
            <img src="/logo.png" alt="App Logo" />
            <span>Sanovise</span>
        </div>
        <nav class="nav">
            <button @click="showSettingsModal = true">⚙ {{ $t('components.header.settings') }}</button>
        </nav>
    </header>
    <SettingsModal v-if="showSettingsModal" @close="showSettingsModal = false" />
</template>

<script setup lang="ts">
const showSettingsModal = ref(false);

function resetAll() {
    useRouter().go(0);
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/header.scss';
</style>