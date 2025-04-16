<template>
    <div ref="responseContainer" class="response-container">
        <div v-if="dataStore.messages.length || dataStore.responseType" class="response">
            <div v-for="(response, index) in dataStore.messages" :key="index" class="response-block" :class="response.role">
                <h3 v-if="response.role === 'assistant'" style="margin-bottom: 1rem;">{{ $t('components.response.title') }}</h3>
                <span v-for="(line, lineIndex) in formatResponse(response.content)" :key="lineIndex" class="line">
                    <span v-html="line"></span><br />
                </span>
            </div>

            <div v-if="dataStore.currentResponse" class="response-block assistant">
                <h3>{{ $t('components.response.title') }}</h3>
                <span v-for="(line, lineIndex) in formatResponse(dataStore.currentResponse)"
                    :key="'stream-' + lineIndex" class="line">
                    <span v-html="line"></span><br />
                </span>
            </div>

            <p v-if="dataStore.responseType" class="thinking-anim">
                {{ $t(`components.response.${dataStore.responseType}`) }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const userScrolled = ref(false);
const isAutoScrolling = ref(false);
const responseContainer = ref<HTMLElement | null>(null);

function formatResponse(text: string) {
    return text.split('\n').map(line => {
        return line
            .replace(/^[-*]\s/g, '<li>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: lightslategrey;">$1</a>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/```(.*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/^###\s/g, '<h3>$1</h3>')
            .replace(/^##\s/g, '<h2>$1</h2>')
            .replace(/^#\s/g, '<h1>$1</h1>');
    });
}

function scrollToBottom() {
    nextTick(() => {
        if (dataStore.messages.length && responseContainer.value) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
}

function onScroll() {
    if (isAutoScrolling.value) return;

    if (responseContainer.value) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
        userScrolled.value = !isAtBottom;
    }
}

function onUserScrollEnd() {
    if (responseContainer.value) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            userScrolled.value = false;
        }
    }
}

watch([() => dataStore.messages, () => dataStore.responseType], async () => {
    await nextTick();
    if (!userScrolled.value) {
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

onMounted(() => {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('wheel', onUserScrollEnd);
    scrollToBottom();
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('wheel', onUserScrollEnd);
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/response.scss';
</style>