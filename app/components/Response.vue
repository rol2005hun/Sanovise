<template>
    <div class="response-container" v-if="dataStore.messages.length || dataStore.responseType">
        <div class="response">
            <div v-for="(response, index) in dataStore.messages" :key="index" class="response-block"
                :class="response.role">
                <h3 v-if="response.role === 'assistant'">{{ $t('components.response.title') }}</h3>
                <div v-for="(line, lineIndex) in formatResponse(response.content)" :key="lineIndex" class="line">
                    <span v-for="(html, htmlIndex) in line" :key="htmlIndex" v-html="html" />
                </div>
            </div>

            <div v-if="dataStore.currentResponse" class="response-block assistant stream">
                <h3>{{ $t('components.response.title') }}</h3>
                <div v-for="(line, lineIndex) in formatResponse(dataStore.currentResponse)" :key="'stream-' + lineIndex"
                    class="line">
                    <span v-for="(html, htmlIndex) in line" :key="'stream-token-' + lineIndex + '-' + htmlIndex"
                        v-html="html" />
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

function tokenizeHTMLLine(line: string): string {
    const match = line.match(/^<(\w+)[^>]*>(.*?)<\/\1>$/);
    if (!match) return line;

    const tag = match[0].match(/<(\w+)[^>]*>/);
    if (!tag) return line;

    const content = match[2];
    const tokenized = content
        .split(/(\s+)/)
        .map(token => {
            if (token.trim() === '') {
                return `<span class="token">&nbsp;</span>`;
            } else return `<span class="token">${token}</span>`;
        }).join('');

    return `${tag[0]}${tokenized}</${tag[1]}>`;
}

function formatMarkdown(line: string): string {
    return line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: lightslategrey;">$1</a>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/"""(.*?)"""/gs, '<pre><code>$1</code></pre>')
        .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
}

function formatResponse(text: string): string[][] {
    return text.split('\n').map(line => {
        if (line.trim() === '') {
            return ['<br>'];
        }

        let formatted = formatMarkdown(line);
        if (/^###\s/.test(line)) {
            return [tokenizeHTMLLine(`<h3>${formatted.replace(/^###\s/, '')}</h3>`)];
        } else if (/^##\s/.test(line)) {
            return [tokenizeHTMLLine(`<h2>${formatted.replace(/^##\s/, '')}</h2>`)];
        } else if (/^#\s/.test(line)) {
            return [tokenizeHTMLLine(`<h1>${formatted.replace(/^#\s/, '')}</h1>`)];
        } else if (/^\s{2}[-*]\s/.test(line)) {
            return [tokenizeHTMLLine(`<li class="sub-list">${formatted.replace(/^\s{2}[-*]\s/, '')}</li>`)];
        } else if (/^\s{3}[-*]\s/.test(line)) {
            return [tokenizeHTMLLine(`<li class="sub-list">${formatted.replace(/^\s{3}[-*]\s/, '')}</li>`)];
        } else if (/^[-*]\s/.test(line)) {
            return [tokenizeHTMLLine(`<li class="list">${formatted.replace(/^[-*]\s/, '')}</li>`)];
        } else if (/^\d+\.\s/.test(line)) {
            return [tokenizeHTMLLine(`<li class="numbered-list">${formatted}</li>`)];
        } else if (/^>\s/.test(line)) {
            return [tokenizeHTMLLine(`<blockquote>${formatted.replace(/^>\s/, '')}</blockquote>`)];
        } else if (/^!\[.*?\]\(.*?\)/.test(line)) {
            const match = line.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
                const altText = match[1];
                const imageUrl = match[2];
                return [tokenizeHTMLLine(`<img src="${imageUrl}" alt="${altText}" />`)];
            }
        }

        const stripped = formatted.replace(/<\/?[^>]+(>|$)/g, match => `${match}`);
        const tokens = stripped.split(/(\s+|<\/?[^>]+>)/).filter(token => token.length > 0);
        const output = tokens.map(token => {
            if (token.trim() === '') {
                return '<span class="token">&nbsp;</span>';
            } else return `<span class="token">${token}</span>`;
        }).join('');

        return [output];
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