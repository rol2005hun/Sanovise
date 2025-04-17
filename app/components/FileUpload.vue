<template>
    <div class="file-upload" @dragover.prevent @drop="handleDrop">
        <input type="file" id="fileInput" @change="importData" accept="application/json" hidden />
        <label for="fileInput" class="upload-label">{{ $t('components.fileUpload.upload') }}</label>
        <p v-if="fileName">{{ $t('components.fileUpload.userData') }}: {{ fileName }}</p>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const fileName = ref<string>('');

function importData(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        fileName.value = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target?.result as string);
                if (jsonData[0]) {
                    dataStore.messages = jsonData;
                }
                else if (jsonData.birthDate && jsonData.gender) {
                    dataStore.userData = jsonData;
                } else {
                    alert('A fájl nem tartalmaz felismerhető adatokat!');
                }
            } catch (error) {
                alert('Hibás JSON fájl!');
            }
        }
        reader.readAsText(file);
    }
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