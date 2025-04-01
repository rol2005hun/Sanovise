<template>
    <form @submit.prevent="submitData" class="data-form">
        <p class="required-info" v-html="$t('components.userForm.requiredInfo')"></p>
        <label for="birthDate">{{ $t('components.userForm.birthDate') }}<span class="required">*</span></label>
        <input type="date" id="birthDate" v-model="dataStore.userData.birthDate" required />

        <label for="gender">{{ $t('components.userForm.gender') }}<span class="required">*</span></label>
        <select id="gender" v-model="dataStore.userData.gender" required>
            <option value="" disabled selected>{{ $t('components.userForm.selectGender') }}</option>
            <option value="male">{{ $t('components.userForm.male') }}</option>
            <option value="female">{{ $t('components.userForm.female') }}</option>
        </select>

        <label for="height">{{ $t('components.userForm.height') }} (cm)<span class="required">*</span></label>
        <input type="number" id="height" v-model="dataStore.userData.height" min="50" max="250" required
            :placeholder="$t('components.userForm.placeholderHeight')" />

        <label for="weight">{{ $t('components.userForm.weight') }} (kg)<span class="required">*</span></label>
        <input type="number" id="weight" v-model="dataStore.userData.weight" min="1" max="500" required
            :placeholder="$t('components.userForm.placeholderWeight')" />

        <button type="button" @click="dataStore.showOptionalFields = !dataStore.showOptionalFields"
            class="toggle-extra">
            {{ dataStore.showOptionalFields ? $t('components.userForm.hideExtra') :
                $t('components.userForm.showExtra') }}
        </button>

        <OptionalFields />

        <div class="privacy-checkbox">
            <input type="checkbox" id="privacyPolicy" v-model="privacyAccepted" required />
            <label for="privacyPolicy">
                {{ $t('components.userForm.acceptPrivacy') }}
                <span @click.stop.prevent="dataStore.showPrivacyModal = true" class="privacy-link">
                    {{ $t('components.userForm.privacyLink') }}<span class="required">*</span>
                </span>
            </label>
        </div>

        <div class="buttons">
            <button v-if="!dataStore.thinking" type="submit"
                :class="['submit', { 'disabled': !privacyAccepted || dataStore.thinking }]"
                :disabled="!privacyAccepted || dataStore.thinking">{{ $t('components.userForm.submitData') }}</button>
            <button v-else type="button" @click="stopAnswering" class="abort">{{ $t('components.userForm.abort')
            }}</button>
            <button type="button" @click="exportData" class="export">{{ $t('components.userForm.exportData') }}</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const privacyAccepted = ref(false);

const submitData = async () => {
    try {
        const controller = new AbortController();
        const { signal } = controller;
        dataStore.controller = controller;
        dataStore.thinking = true;
        dataStore.serverResponse = '';

        const response = await fetch('https://api.app.sanovise.ranzak.site/api/advice', {
            method: 'POST',
            signal,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(dataStore.userData),
        });

        if (!response.body) {
            throw new Error('A válasz üres.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        dataStore.serverResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                dataStore.thinking = false;
                break;
            }
            dataStore.serverResponse += decoder.decode(value, { stream: true });
        }
    } catch (error: any) {
        dataStore.thinking = false;
        if (error.name !== 'AbortError') {
            dataStore.serverResponse = 'Hiba történt az adatok küldése közben: ' + error.message;
        }
    }
}

const stopAnswering = () => {
    if (dataStore.controller) {
        dataStore.controller.abort();
        dataStore.thinking = false;
    }
}

const exportData = () => {
    const blob = new Blob([JSON.stringify(dataStore.userData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_data.json';
    link.click();
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/userform.scss';
</style>
