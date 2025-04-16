<template>
    <div class="chat-box" v-if="dataStore.messages.length && !dataStore.responseType">
        <form @submit.prevent="sendMessage" @keyup.enter="sendMessage" class="input-area">
            <textarea v-model="userInput" :placeholder="$t('components.chatInterface.placeholder')" class="chat-input"
                ref="textarea" rows="1"></textarea>
            <button type="submit" class="send-button">➤</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const userInput = ref('');
const textarea = ref<HTMLTextAreaElement | null>(null);

async function sendMessage() {
    if (!userInput.value.trim()) return;

    const message = userInput.value.trim();

    dataStore.messages.push({
        role: 'user',
        content: message
    });

    userInput.value = '';
    if (textarea.value) textarea.value.style.height = 'auto';

    try {
        dataStore.responseType = 'analyzing';
        dataStore.currentResponse = '';
        const controller = new AbortController();
        const { signal } = controller;
        dataStore.controller = controller;

        const response = await fetch('https://api.app.sanovise.ranzak.site/api/advice2', {
            method: 'POST',
            signal,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...dataStore.userData,
                messages: dataStore.messages
            })
        });

        if (!response.body) {
            throw new Error('A válasz üres.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        dataStore.currentResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                dataStore.responseType = null;

                if (dataStore.currentResponse.trim()) {
                    dataStore.messages.push({
                        role: 'assistant',
                        content: dataStore.currentResponse.trim()
                    });
                }
                dataStore.currentResponse = '';
                break;
            }

            dataStore.currentResponse += decoder.decode(value, { stream: true });
            dataStore.responseType = 'thinking';
        }
    } catch (error: any) {
        dataStore.responseType = null;
        if (error.name !== 'AbortError') {
            const errorMsg = 'Hiba történt az adatok küldése közben: ' + error.message;
            dataStore.messages.push({
                role: 'assistant',
                content: errorMsg
            });
        }
        dataStore.currentResponse = '';
    }
}

onMounted(() => {
    if (textarea.value) {
        textarea.value!.addEventListener('input', () => {
            textarea.value!.style.height = `${Math.min(textarea.value!.scrollHeight, 150)}px`;
        });
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/chatinterface.scss';
</style>