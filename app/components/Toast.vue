<template>
    <div class="toast-container">
        <TransitionGroup name="toast-fade" tag="div">
            <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
                <span class="message">{{ toast.message }}</span>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { toastStore } from '@/store';

const toasts = computed(() => toastStore.toasts);
</script>

<style lang="scss" scoped>
@use '@/assets/styles/components/toast.scss';
</style>