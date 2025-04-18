<template>
    <div class="response-container" v-if="dataStore.messages.length || dataStore.responseType">
        <div class="response">
            <div v-for="(response, index) in dataStore.messages" :key="index" class="response-block"
                :class="response.role">
                <h3 v-if="response.role === 'assistant'">{{ $t('components.response.title') }}</h3>
                <div v-for="(line, lineIndex) in formatResponse(response.content)" :key="lineIndex" class="line">
                    <div v-for="(token, tokenIndex) in line" :key="tokenIndex" class="token" v-html="token"></div>
                </div>
            </div>

            <div v-if="dataStore.currentResponse" class="response-block assistant stream">
                <h3>{{ $t('components.response.title') }}</h3>
                <div v-for="(line, lineIndex) in formatResponse(dataStore.currentResponse)" :key="'stream-' + lineIndex"
                    class="line">
                    <div v-for="(token, tokenIndex) in line" :key="'stream-token-' + lineIndex + '-' + tokenIndex"
                        class="token" v-html="token"></div>
                </div>
            </div>

            <div class="response-anim" v-if="dataStore.responseType">
                <span class="thinking-anim">
                    {{ $t(`components.response.${dataStore.responseType}`) }}
                </span>
                <button class="stop-answering" @click="stopAnswering"><i class="fa-solid fa-stop"></i></button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const userScrolled = ref(false);
const isAutoScrolling = ref(false);

function formatResponse(text: string): string[][] {
    const formatMarkdown = (line: string) => {
        return line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: lightslategrey;">$1</a>')  // Links
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/"""(.*?)"""/gs, '<pre><code>$1</code></pre>')
            .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    };

    return text.split('\n').map(line => {
        if (line.trim() === '') {
            return [''];
        }

        let formatted = formatMarkdown(line);

        if (/^###\s/.test(line)) {
            formatted = `<h3>${formatted.replace(/^###\s/, '')}</h3>`;
            return [formatted];
        }
        if (/^##\s/.test(line)) {
            formatted = `<h2>${formatted.replace(/^##\s/, '')}</h2>`;
            return [formatted];
        }
        if (/^#\s/.test(line)) {
            formatted = `<h1>${formatted.replace(/^#\s/, '')}</h1>`;
            return [formatted];
        }

        if (/^[-*]\s/.test(line)) {
            formatted = `<li>${formatted.replace(/^[-*]\s/, '')}</li>`;
            return [formatted];
        }

        formatted = formatted.replace(/(\s+)/g, '&nbsp;');

        return formatted.split(/(\s+)/).filter(token => token.length > 0);
    });
}

function stopAnswering() {
    if (dataStore.controller) {
        dataStore.controller.abort();
        dataStore.responseType = null;

        if (dataStore.currentResponse && dataStore.currentResponse.trim()) {
            dataStore.messages.push({
                role: 'assistant',
                content: dataStore.currentResponse.trim()
            });
        }

        dataStore.currentResponse = '';
    }

    scrollToBottom();
}

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

watch([() => dataStore.messages, () => dataStore.responseType, () => dataStore.currentResponse], async () => {
    await nextTick();
    if (!userScrolled.value) {
        scrollToBottom();
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