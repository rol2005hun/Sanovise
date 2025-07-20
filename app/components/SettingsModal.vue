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

            <p class="version-info">
                {{ $t('components.settingsModal.version') }}: {{ appVersion }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';
import packageJson from '../package.json';

const { locales, locale, setLocale } = useI18n();
const aiModels = [
    { id: 'zeeshaan-ai/Medical-Summary-Notes-ONNX', name: 'Dr. Sanovise', type: 'advice'},
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', type: 'advice2'},
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'DeepSeek V3', type: 'advice2'},
    { id: 'deepseek/deepseek-r1-zero:free', name: 'DeepSeek R1 Zero', type: 'advice2'},
    { id: 'microsoft/mai-ds-r1:free', name: 'MAI DS R1', type: 'advice2'},
    { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', type: 'advice2'}
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
  get: () => selectedModel.value.id,
  set: (newId: string) => {
    const newModel = aiModels.find(model => model.id === newId);
    if (newModel) {
      selectedModel.value = newModel;
      dataStore.userData.selectedModel = newModel;
    }
  }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/settingsmodal.scss';
</style>