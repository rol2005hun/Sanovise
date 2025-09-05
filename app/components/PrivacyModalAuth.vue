<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <button class="close-button" @click="closeModal">×</button>
            <h2>{{ $t('components.privacyModalAuth.title') }}</h2>
            <p>{{ $t('components.privacyModalAuth.text1') }}</p>
            <p>{{ $t('components.privacyModalAuth.text2') }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';
import { onMounted, onUnmounted } from 'vue';

const ds = dataStore;

function closeModal() {
    ds.showPrivacyModal = false
}

onMounted(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/privacymodal.scss';
</style>