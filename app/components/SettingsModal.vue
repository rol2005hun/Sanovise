<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <button class="close-button" @click="$emit('close')">×</button>
            <h2>{{ $t('components.settingsModal.title') }}</h2>
            <p>{{ $t('components.settingsModal.text') }}</p>

            <div class="language-selection">
                <select id="language" v-model="language" class="language-select">
                    <option v-for="locale in locales" :key="locale.code" :value="locale.code">
                        {{ locale.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { locales, locale, setLocale } = useI18n();

const language = computed({
    get: () => locale.value,
    set: (value) => {
        setLocale(value);
    }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/settingsmodal.scss';
</style>