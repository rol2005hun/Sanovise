<template>
    <div class="streamed-response">
      <component
        v-for="(block, blockIndex) in structuredTokens"
        :key="blockIndex"
        :is="block.tag"
        v-bind="block.attrs"
      >
        <template v-for="(token, i) in block.tokens" :key="`${blockIndex}-${i}`">
          <span class="token" v-html="token.html" />
        </template>
      </component>
    </div>
  </template>
  
  <script setup lang="ts">
  import { watch, ref } from 'vue';
  import { marked } from 'marked';
  import { dataStore } from '@/store';
  
  type Token = { html: string; delay: number };
  type Block = { tag: string; attrs: Record<string, string>; tokens: Token[] };
  
  const structuredTokens = ref<Block[]>([]);
  let fullBuffer = '';
  let animationIndex = 0;
  
  watch(() => dataStore.currentResponse, async (newVal) => {
    if (!newVal) return;
  
    const newChunk = newVal.slice(fullBuffer.length);
    if (!newChunk) return;
  
    fullBuffer = newVal;
  
    const html = await marked.parse(fullBuffer);
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
          const words = (child.textContent || '').split(/(\s+)/g);
          for (const word of words) {
            if (word === '') continue;
            tokens.push({
              html: word === ' ' ? '&nbsp;' : word,
              delay: parseFloat((animationIndex++ * 0.04).toFixed(2)),
            });
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const nested = walk(child as HTMLElement);
          if (nested) blocks.push(nested);
        }
      });
  
      return { tag, attrs, tokens };
    }
  
    Array.from(container.children).forEach((el) => {
      const block = walk(el as HTMLElement);
      if (block) blocks.push(block);
    });
  
    return blocks;
  }
  </script>
  
  <style>
  .streamed-response {
    font-family: sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    max-width: 700px;
    margin: auto;
    padding: 1rem;
    background: black;
    border-radius: 12px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    white-space: normal;
    word-wrap: break-word;
    color: #f1f1f1;
  }
  
  .token {
    display: inline-block;
    animation: fadeInUp 0.3s ease-out forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  