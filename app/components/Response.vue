<template>
    <div ref="responseContainer" class="response-container">
        <div v-if="dataStore.serverResponse || dataStore.responseType" class="response">
            <h3>{{ $t('components.response.title') }}</h3>
            <p v-if="dataStore.serverResponse" class="response-text">
                <span v-for="(line, lineIndex) in wordsList" :key="lineIndex" class="line">
                    <span v-for="(word, wordIndex) in line" :key="wordIndex" class="word">
                        {{ word }}
                        <span class="space" v-if="wordIndex < line.length - 1"> </span>
                    </span>
                    <br />
                </span>
            </p>
            <p v-if="dataStore.responseType" class="thinking-anim">{{
                $t(`components.response.${dataStore.responseType}`) }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const userScrolled = ref(false);
const isAutoScrolling = ref(false);
const responseContainer = ref<HTMLElement | null>(null);

const wordsList = computed(() => {
    if (!dataStore.serverResponse) return [];
    return dataStore.serverResponse.split('\n').map((line: string) => line.split(' '));
});

const onScroll = () => {
    if (isAutoScrolling.value) return;

    if (responseContainer.value) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        userScrolled.value = !isAtBottom;
    }
}

const onUserScrollEnd = () => {
    if (responseContainer.value) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            userScrolled.value = false;
        }
    }
}

watch([() => dataStore.serverResponse, () => dataStore.responseType], async () => {
    await nextTick();
    if (!userScrolled.value) {
        isAutoScrolling.value = true;
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

        setTimeout(() => {
            isAutoScrolling.value = false;
        }, 500);
    }
});

onMounted(() => {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('wheel', onUserScrollEnd);
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('wheel', onUserScrollEnd);
});
</script>


<style scoped lang="scss">
@use '@/assets/styles/components/response.scss';
</style>