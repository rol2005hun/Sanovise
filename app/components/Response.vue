<template>
    <div class="response-container" v-if="dataStore.messages.length || dataStore.responseType">
        <div class="response">
            <div v-for="(response, index) in dataStore.messages" :key="index" class="response-block"
                :class="response.role">
                <h3 v-if="response.role === 'assistant'">{{ $t('components.response.title') }}</h3>
                <div v-html="marked.parse(response.content)" class="block"></div>
            </div>

            <div v-if="dataStore.currentResponse" class="response-block assistant stream">
                <h3>{{ $t('components.response.title') }}</h3>
                <div v-html="marked.parse(dataStore.currentResponse)" class="block"></div>
            </div>

            <div class="response-anim" v-if="dataStore.responseType">
                <span class="thinking-anim">
                    {{ $t(`components.response.${dataStore.responseType}`) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { dataStore } from '@/store';

const userScrolled = ref(false);
const isAutoScrolling = ref(false);

function scrollToBottom() {
    nextTick(() => {
        if ((dataStore.messages.length || dataStore.currentResponse) && !userScrolled.value) {
            isAutoScrolling.value = true;
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isAutoScrolling.value = false;
            }, 500);
        }
    });
}

function onScroll() {
    if (isAutoScrolling.value) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    userScrolled.value = !isAtBottom;
}

function onUserScrollEnd() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        userScrolled.value = false;
    }
}

watch(
    [() => dataStore.messages, () => dataStore.responseType, () => dataStore.currentResponse], async () => {
        await nextTick();

        if (!userScrolled.value) {
            scrollToBottom();
        }
    }
);

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