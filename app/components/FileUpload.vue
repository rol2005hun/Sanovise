<template>
    <div class="upload-container" v-if="dataStore.showForm">
        <h2>{{ $t('components.fileUpload.title') }}:</h2>
        <div class="file-upload" @dragover.prevent @drop="handleDrop">
            <input type="file" id="fileInput" @change="importData" accept="application/json" hidden />
            <label for="fileInput" class="upload-label">{{ $t('components.fileUpload.upload') }}</label>
            <span v-if="fileName">{{ $t('components.fileUpload.lastLoaded') }}: {{ fileName }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore, toastStore } from '@/store';

const fileName = ref<string>('');
const { t } = useI18n();

function importData(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    fileName.value = file.name;
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target?.result as string);

            if (jsonData.birthDate) {
                dataStore.userData = {
                    ...dataStore.userData,
                    ...jsonData
                };
            } else if (Array.isArray(jsonData) && jsonData[0]?.role) {
                dataStore.messages = jsonData;
            } else {
                toastStore.show(`⚠️ ${t('global.errorLoad')}\n\n${t('global.anotherFile')}`, 'error');
            }
        } catch (error) {
            toastStore.show(`⚠️ ${t('global.invalidJson')}\n\n${t('global.anotherFile')}`, 'error');
        }
    };

    reader.readAsText(file);
}

function handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
        const file = event.dataTransfer.files[0];
        importData({ target: { files: [file] } } as unknown as Event);
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/fileupload.scss';
</style>