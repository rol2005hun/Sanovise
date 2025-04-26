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
                <select id="ai-model" v-model="selectedModel" class="ai-model-select">
                    <option v-for="model in aiModels" :key="model.id" :value="model.id">
                        {{ model.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const { locales, locale, setLocale } = useI18n();

const aiModels = [
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1' },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3' },
    { id: 'microsoft/mai-ds-r1:free', name: 'MAI DS R1' },
    { id: 'deepseek/deepseek-r1-zero:free', name: 'DeepSeek R1 Zero' },
];

const selectedModel = ref(aiModels[0].id);

const language = computed({
    get: () => locale.value,
    set: (value) => {
        setLocale(value);
    }
});

watch(selectedModel, (newModel) => {
    dataStore.userData.selectedModel = newModel;
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/settingsmodal.scss';
</style>