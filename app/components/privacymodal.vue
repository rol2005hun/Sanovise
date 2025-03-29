<template>
    <div class="modal-overlay" v-if="dataStore.showPrivacyModal">
        <div class="modal-content">
            <button class="close-button" @click="dataStore.showPrivacyModal = false">×</button>
            <h2>{{ $t('components.privacyModal.title') }}</h2>
            <p>{{ $t('components.privacyModal.text1') }}</p>
            <p>{{ $t('components.privacyModal.text2') }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/privacymodal.scss';
</style>