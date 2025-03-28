<template>
    <div ref="responseContainer" class="response-container">
        <div v-if="dataStore.serverResponse || dataStore.thinking" class="response">
            <h3>Dr. Sanovise Mi válasza:</h3>
            <p v-if="dataStore.serverResponse">{{ dataStore.serverResponse }}</p>
            <p v-if="dataStore.thinking" class="thinking-anim">Gondolkodom 🤔</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { dataStore } from '@/store';

const responseContainer = ref<HTMLElement | null>(null);

watch([() => dataStore.serverResponse, () => dataStore.thinking], async () => {
    await nextTick();
    if (responseContainer.value) {
        responseContainer.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/response.scss';
</style>
