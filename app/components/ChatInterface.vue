<template>
    <div class="chat-box">
        <form @submit.prevent="sendMessage" class="input-area">
            <textarea v-model="userInput" @keydown.enter="sendMessage"
                :placeholder="$t('components.chatInterface.placeholder')" class="chat-input" ref="textarea"
                rows="1"></textarea>

            <button type="button" :class="['download-button', {
                disabled: dataStore.messages.length < 1
            }]" :disabled="dataStore.messages.length < 1" @click="exportChat">
                <i class="fa-solid fa-download"></i>
            </button>

            <button type="submit" :class="['send-button', {
                disabled: !isUserDataComplete || !!dataStore.responseType || dataStore.acceptedPrivacyPolicy === false || userInput.trim() === ''
            }]"
                :disabled="!isUserDataComplete || !!dataStore.responseType || dataStore.acceptedPrivacyPolicy === false || userInput.trim() === ''">
                ➤</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { dataStore, toastStore } from '@/store';

const userInput = ref('');
const textarea = ref<HTMLTextAreaElement | null>(null);
const { t, locale } = useI18n();

const isUserDataComplete = computed(() => {
    const data = dataStore.userData;
    return (
        data.birthDate !== '' &&
        data.gender !== '' &&
        data.height !== '' &&
        data.weight !== ''
    );
});

async function sendMessage() {
    if (!validateForm()) return;
    const message = userInput.value.trim();
    if (!message) return;

    dataStore.messages.push({
        role: 'user',
        content: message,
    });

    userInput.value = '';
    if (textarea.value) textarea.value.style.height = 'auto';

    try {
        dataStore.responseType = 'analyzing';
        dataStore.currentResponse = '';
        dataStore.userData.language = locale.value;
        const controller = new AbortController();
        const { signal } = controller;
        dataStore.controller = controller;

        const response = await fetch('https://api.app.sanovise.ranzak.site/api/advice2', {
            method: 'POST',
            signal,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                ...dataStore.userData,
                messages: dataStore.messages,
            }),
        });

        if (!response.body) throw new Error(t('global.emptyResponse'));

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        dataStore.currentResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                dataStore.responseType = null;

                const trimmed = dataStore.currentResponse.trim();
                if (trimmed) {
                    dataStore.messages.push({
                        role: 'assistant',
                        content: trimmed,
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
            dataStore.messages.push({
                role: 'assistant',
                content: `⚠️ ${t('global.errorSend')} 😕\n\n${error.message}\n\n${t('global.tryAgain')}`,
            });
        }
        dataStore.currentResponse = '';
    }
}

async function exportChat() {
    const data = JSON.stringify(dataStore.messages, null, 2);
    const fileName = 'chat_data.json';

    if (Capacitor.isNativePlatform()) {
        try {
            if (!checkPermissions()) return;

            await Filesystem.writeFile({
                path: fileName,
                data,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });

            toastStore.show(`✅ ${t('global.successSave')}: ${fileName}`, 'success');

            await Filesystem.writeFile({
                path: fileName,
                data,
                directory: Directory.Cache,
                encoding: Encoding.UTF8,
            });

            const fileUri = await Filesystem.getUri({
                path: fileName,
                directory: Directory.Cache,
            });

            await Share.share({
                title: 'user_data.json',
                url: fileUri.uri
            });

            toastStore.show(`✅ ${t('global.successShare')}: ${fileName}`, 'success');
        } catch (err) {
            toastStore.show(`⚠️ ${t('global.errorSave')}\n\n${t('global.tryAgain')}`, 'error');
        }
    } else {
        try {
            const blob = new Blob([data], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        } catch {
            toastStore.show(`⚠️ ${t('global.errorSave')}\n\n${t('global.tryAgain')}`, 'error');
        }
    }
}

onMounted(() => {
    if (textarea.value) {
        textarea.value.addEventListener('input', () => {
            textarea.value!.style.height = `${Math.min(textarea.value!.scrollHeight, 150)}px`;
        });
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/chatinterface.scss';
</style>