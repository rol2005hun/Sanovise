<template>
    <div class="file-upload" @dragover.prevent @drop="handleDrop">
        <input type="file" id="fileInput" @change="importData" accept="application/json" hidden />
        <label for="fileInput" class="upload-label">{{ $t('components.fileUpload.upload') }}</label>
        <p v-if="fileName">{{ $t('components.fileUpload.loaded') }}: {{ fileName }}</p>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const fileName = ref<string>('');

const importData = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        fileName.value = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                dataStore.userData = JSON.parse(e.target?.result as string);
            } catch (error) {
                alert('Hibás JSON fájl!');
            }
        }
        reader.readAsText(file);
    }
}

const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
        importData({ target: { files: event.dataTransfer.files } } as unknown as Event);
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/fileupload.scss';
</style>