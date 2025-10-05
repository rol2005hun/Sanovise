<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">×</button>
            <h2>{{ $t('components.settingsModal.title') }}</h2>

            <div class="language-selection">
                <label for="language">{{ $t('components.settingsModal.selectLanguage') }}</label>
                <select id="language" v-model="language" class="language-select">
                    <option v-for="locale in locales" :key="locale.code" :value="locale.code">
                        {{ locale.name }}
                    </option>
                </select>
            </div>

            <div class="ai-model-selection">
                <label for="ai-model">{{ $t('components.settingsModal.selectAIModel') }}</label>
                <select id="ai-model" v-model="selectedModelId" class="ai-model-select">
                    <option v-for="model in aiModels" :key="model.id" :value="model.id">
                        {{ model.name }}
                    </option>
                </select>
            </div>

            <div class="logout-row" v-if="dataStore.isLoggedIn">
                <div class="account-actions">
                    <button class="delete-btn" @click="handleDeleteAccount">{{
                        $t('components.settingsModal.deleteAccount') }}</button>
                    <button class="logout-btn" @click="handleLogout">
                        {{ $t('components.settingsModal.logout') }}
                    </button>
                </div>
            </div>

            <p class="version-info">
                {{ $t('components.settingsModal.version') }}: {{ appVersion }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore, toastStore } from '@/store';
import packageJson from '../package.json';

const { locales, locale, setLocale } = useI18n();
const aiModels = [
    { id: 'zeeshaan-ai/Medical-Summary-Notes-ONNX', name: 'Dr. Sanovise', type: 'advice' },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', type: 'advice2' },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3', type: 'advice2' },
    { id: 'deepseek/deepseek-r1-zero:free', name: 'DeepSeek R1 Zero', type: 'advice2' },
    { id: 'microsoft/mai-ds-r1:free', name: 'MAI DS R1', type: 'advice2' },
    { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', type: 'advice2' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder', type: 'advice2' }
];
const appVersion = ref(packageJson.version);
const selectedModel = ref(aiModels.find(model => model.id === dataStore.userData.selectedModel?.id) || aiModels[1]);

const language = computed({
    get: () => locale.value,
    set: (value: string) => {
        setLocale(value as any);
    }
});

const selectedModelId = computed({
    get: () => selectedModel.value?.id ?? '',
    set: (newId: string) => {
        const newModel = aiModels.find(model => model.id === newId);
        if (newModel) {
            selectedModel.value = newModel;
            dataStore.userData.selectedModel = newModel;
        }
    }
});

const tokenCookie = useCookie('sanovise_token', { path: '/', maxAge: 60 * 60 * 24 * 30 });

function handleLogout() {
    tokenCookie.value = null;
    toastStore.show('✅ ' + (useNuxtApp().$i18n.t('pages.auth.logoutSuccess') as string), 'info');
    dataStore.setLoggedIn(false);
}

async function handleDeleteAccount() {
    const confirmText = (useNuxtApp().$i18n.t('components.settingsModal.deleteConfirm') as string) || 'Are you sure you want to delete your account? This action is permanent.';
    if (!confirm(confirmText)) return;

    try {
        const token = tokenCookie.value;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res: any = await $fetch('http://138.68.77.184:6969/api/auth/delete', {
            method: 'DELETE',
            credentials: 'include',
            headers
        });

        if (res && res.success) {
            tokenCookie.value = null;
            dataStore.setLoggedIn(false);
            toastStore.show('✅ ' + ((useNuxtApp().$i18n.t('components.settingsModal.deleteSuccess') as string) || 'Account deleted'), 'info');
            return;
        }

        const serverMsg = res && res.error ? String(res.error) : ((useNuxtApp().$i18n.t('components.settingsModal.deleteError') as string) || 'An error occurred while deleting the account');
        throw new Error(serverMsg);
    } catch (err: any) {
        console.error('[Sanovise - Error] delete account failed', err);
        const msg = err && err.message ? err.message : ((useNuxtApp().$i18n.t('components.settingsModal.deleteError') as string) || 'An error occurred while deleting the account');
        toastStore.show('❌ ' + msg, 'error');
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/settingsmodal.scss';
</style>