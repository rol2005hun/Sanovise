<template>
    <div ref="responseContainer" class="response-container">
        <div v-if="dataStore.serverResponse || dataStore.thinking" class="response">
            <h3>Dr. Sanovise Mi válasza:</h3>
            <p v-if="dataStore.serverResponse" class="response-text">
                <span v-for="(line, lineIndex) in wordsList" :key="lineIndex" class="line">
                    <span v-for="(word, wordIndex) in line" :key="wordIndex" class="word">
                        {{ word }}
                        <span class="space" v-if="wordIndex < line.length - 1"> </span>
                    </span>
                    <br />
                </span>
            </p>
            <p v-if="dataStore.thinking" class="thinking-anim">Gondolkodom 🤔</p>
        </div>
    </div>
</template>


<script setup lang="ts">
import { dataStore } from '@/store';

const responseContainer = ref<HTMLElement | null>(null);
const wordsList = computed(() => {
    if (!dataStore.serverResponse) return [];
    return dataStore.serverResponse.split('\n').map((line: string) => line.split(' '));
});

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