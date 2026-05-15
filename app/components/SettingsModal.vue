<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">×</button>
            <h2>{{ $t("components.settingsModal.title") }}</h2>

            <div class="language-selection">
                <label for="language">{{ $t("components.settingsModal.selectLanguage") }}</label>
                <select id="language" v-model="language" class="language-select">
                    <option v-for="locale in locales" :key="locale.code" :value="locale.code">
                        {{ locale.name }}
                    </option>
                </select>
            </div>

            <div class="ai-model-selection">
                <label for="ai-model">{{ $t("components.settingsModal.selectAIModel") }}</label>
                <select id="ai-model" v-model="selectedModelId" class="ai-model-select">
                    <option v-for="model in aiModels" :key="model.id" :value="model.id">
                        {{ model.name }}
                    </option>
                </select>
            </div>

            <div class="logout-row" v-if="dataStore.isLoggedIn">
                <div class="account-actions">
                    <button class="delete-btn" @click="handleDeleteAccount">{{ $t("components.settingsModal.deleteAccount") }}</button>
                    <button class="logout-btn" @click="handleLogout">
                        {{ $t("components.settingsModal.logout") }}
                    </button>
                </div>
            </div>

            <p class="version-info">
                {{ $t("components.settingsModal.version") }}: {{ appVersion }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { dataStore, toastStore } from '@/store';
import packageJson from '../package.json';
import { useI18n } from 'vue-i18n';
import { useNuxtApp, useCookie } from '#imports';

interface AIModel {
    id: string;
    name: string;
    type: string;
}

interface DeleteAccountResponse {
    success?: boolean;
    error?: string;
}

const { locales, locale, setLocale } = useI18n();

const aiModels: AIModel[] = [
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3', type: 'advice2' },
    { id: 'deepseek/deepseek-r1-zero:free', name: 'DeepSeek R1 Zero', type: 'advice2' },
    { id: 'microsoft/mai-ds-r1:free', name: 'MAI DS R1', type: 'advice2' },
    { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', type: 'advice2' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder', type: 'advice2' },
    { id: 'x-ai/grok-4.1-fast:free', name: 'xAI - Grok 4.1', type: 'advice2' },
    { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'NVIDIA Nemotron 3 Nano', type: 'advice2' },
    { id: 'nvidia/nemotron-nano-12b-2-vl:free', name: 'NVIDIA Nemotron Nano 12B', type: 'advice2' },
    { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen3 Next 80B', type: 'advice2' },
    { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'NVIDIA Nemotron Nano 9B V2', type: 'advice2' },
    { id: 'openai/gpt-oss-120b:free', name: 'OpenAI gpt-oss-120b', type: 'advice2' },
    { id: 'openai/gpt-oss-20b:free', name: 'OpenAI gpt-oss-20b', type: 'advice2' },
    { id: 'z-ai/glm-4.5-air:free', name: 'Z.ai GLM 4.5 Air', type: 'advice2' },
    { id: 'qwen/qwen3-coder-480b-a35b-instruct:free', name: 'Qwen3 Coder 480B', type: 'advice2' },
    { id: 'venice/uncensored:free', name: 'Venice Uncensored', type: 'advice2' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Meta Llama 3.3 70B', type: 'advice2' },
    { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Meta Llama 3.2 3B', type: 'advice2' },
    { id: 'nousresearch/hermes-3-405b-instruct:free', name: 'Nous Hermes 3 405B', type: 'advice2' }
];

const appVersion = ref<string>(packageJson.version);
const selectedModel = ref<AIModel>(aiModels.find(model => model.id === dataStore.userData.selectedModel?.id) || aiModels[0]);

const language = computed({
    get: (): string => locale.value,
    set: (value: string): void => {
        setLocale(value);
    }
});

const selectedModelId = computed({
    get: (): string => selectedModel.value?.id ?? '',
    set: (newId: string): void => {
        const newModel = aiModels.find(model => model.id === newId);
        if (newModel) {
            selectedModel.value = newModel;
            dataStore.userData.selectedModel = newModel;
        }
    }
});

const tokenCookie = useCookie<string | null>('sanovise_token', { path: '/', maxAge: 60 * 60 * 24 * 30 });

function handleLogout(): void {
    tokenCookie.value = null;
    toastStore.show('✅ ' + String(useNuxtApp().$i18n.t('pages.auth.logoutSuccess')), 'info');
    dataStore.setLoggedIn(false);
}

async function handleDeleteAccount(): Promise<void> {
    const confirmText = String(useNuxtApp().$i18n.t('components.settingsModal.deleteConfirm')) || 'Are you sure you want to delete your account? This action is permanent.';
    if (!confirm(confirmText)) return;

    try {
        const token = tokenCookie.value;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await $fetch<DeleteAccountResponse>('/api/auth/delete', {
            method: 'DELETE',
            credentials: 'include',
            headers
        });

        if (res && res.success) {
            tokenCookie.value = null;
            dataStore.setLoggedIn(false);
            toastStore.show('✅ ' + (String(useNuxtApp().$i18n.t('components.settingsModal.deleteSuccess')) || 'Account deleted'), 'info');
            return;
        }

        const serverMsg = res && res.error ? String(res.error) : (String(useNuxtApp().$i18n.t('components.settingsModal.deleteError')) || 'An error occurred while deleting the account');
        throw new Error(serverMsg);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : (String(useNuxtApp().$i18n.t('components.settingsModal.deleteError')) || 'An error occurred while deleting the account');
        toastStore.show('❌ ' + msg, 'error');
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/settingsmodal.scss';
</style>