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
                <component v-for="(block, blockIndex) in structuredTokens" :key="blockIndex" :is="block.tag"
                    v-bind="block.attrs" class="block">
                    <template v-for="(token, i) in block.tokens" :key="`${blockIndex}-${i}`">
                        <span v-if="token.type === 'text'" class="token" v-html="token.value"></span>
                        <span v-else v-html="token.value"></span>
                    </template>
                </component>
            </div>

            <div class="response-anim" v-if="dataStore.responseType">
                <span class="thinking-anim">
                    {{ $t(`components.response.${dataStore.responseType}`) }}
                </span>
                <button class="stop-answering" @click="stopAnswering">
                    <i class="fa-solid fa-stop"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { dataStore } from '@/store';

type Token = { type: 'text' | 'html'; value: string };
type Block = { tag: string; attrs: Record<string, string>; tokens: Token[] };

const userScrolled = ref(false);
const isAutoScrolling = ref(false);
const structuredTokens = ref<Block[]>([]);
let fullBuffer = '';
let animationIndex = 0;

watch(() => dataStore.currentResponse, async (newVal) => {
    if (!newVal) return;

    const newChunk = newVal.slice(fullBuffer.length);
    if (!newChunk) return;

    fullBuffer = newVal;

    const html = await Promise.resolve(marked(fullBuffer));
    const container = document.createElement('div');
    container.innerHTML = html;

    const parsed = parseDomToStructuredTokens(container);
    structuredTokens.value = parsed;
});

function parseDomToStructuredTokens(container: HTMLElement): Block[] {
    const blocks: Block[] = [];
    animationIndex = 0;

    function walk(node: HTMLElement): Block | null {
        if (!node.tagName) return null;

        const tag = node.tagName.toLowerCase();
        const attrs: Record<string, string> = {};
        for (const attr of node.attributes) {
            attrs[attr.name] = attr.value;
        }

        const tokens: Token[] = [];

        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent || '';
                const lines = text.split('\n');

                lines.forEach((line, lineIndex) => {
                    const parts = line.split(/(\s+)/g);
                    console.log(parts);
                    parts.forEach((part) => {
                        if (part.trim() === '') {
                            tokens.push({ type: 'text', value: '&nbsp;' });
                        } else {
                            tokens.push({ type: 'text', value: part });
                        }
                    });

                    if (lineIndex < lines.length - 1) {
                        tokens.push({ type: 'html', value: '<br />' });
                    }
                });
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as HTMLElement;

                if (el.tagName.toLowerCase() === 'br') {
                    tokens.push({ type: 'html', value: '<br />' });
                } else {
                    const span = document.createElement('span');
                    span.appendChild(el.cloneNode(true));
                    tokens.push({ type: 'text', value: span.innerHTML });
                }
            }
        });

        if (tokens.length === 0) {
            tokens.push({ type: 'text', value: '&nbsp;' });
        }

        return { tag, attrs, tokens };
    }

    Array.from(container.children).forEach((el) => {
        const block = walk(el as HTMLElement);
        if (block) blocks.push(block);
    });

    return blocks;
}

function stopAnswering() {
    if (dataStore.controller) {
        dataStore.controller.abort();
        dataStore.responseType = null;

        if (dataStore.currentResponse?.trim()) {
            dataStore.messages.push({
                role: 'assistant',
                content: dataStore.currentResponse.trim()
            });
        }

        dataStore.currentResponse = '';
        fullBuffer = '';
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

watch(
    [() => dataStore.messages, () => dataStore.responseType, () => dataStore.currentResponse],
    async ([messages, responseType, currentResponse]) => {
        if (currentResponse?.trim()) {
            const html = await Promise.resolve(marked(currentResponse));
            const container = document.createElement('div');
            container.innerHTML = html;

            const parsed = parseDomToStructuredTokens(container);
            structuredTokens.value = parsed;
        }

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