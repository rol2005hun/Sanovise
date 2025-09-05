<template>
    <div class="modal-overlay" v-if="isVisible && $route.path === '/' && !dataStore.isLoggedIn">
        <div class="modal-content">
            <button class="close-button" @click="closeModal">×</button>
            <h2>{{ $t('components.authModal.title') }}</h2>
            <p>{{ $t('components.authModal.description') }}</p>
            <button class="go" @click="gotoAuth">{{ $t('components.authModal.go') }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const isVisible = ref(false);

const emit = defineEmits(['close']);

function closeModal() {
    isVisible.value = false;
}

function gotoAuth() {
    isVisible.value = false;
    navigateTo('/auth');
}

onMounted(() => {
    isVisible.value = true;
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/components/authmodal.scss';
</style>