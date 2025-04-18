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
                        <span class="token" v-html="token"></span>
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

type Block = { tag: string; attrs: Record<string, string>; tokens: string[] };

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

        const tokens: string[] = [];

        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent || '';
                const words = text.split(/(\s+)/g);
                words.forEach((word) => {
                    if (word === ' ') {
                        tokens.push('&nbsp;');
                    } else if (word.trim() !== '') {
                        tokens.push(word);
                    }
                });
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const el = child as HTMLElement;

                if (el.tagName.toLowerCase() === 'br') {
                    tokens.push('<br />');
                } else {
                    const span = document.createElement('span');
                    span.appendChild(el.cloneNode(true));
                    tokens.push(span.innerHTML);
                }
            }
        });

        if (tokens.length === 0) {
            tokens.push('&nbsp;');
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
    async () => {
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