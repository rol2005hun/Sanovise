<template>
    <form @submit.prevent="submitData" class="data-form">
        <p class="required-info">
            A<span class="required">*</span>-gal jelölt mezők kitöltése kötelező!
        </p>
        <label for="birthDate">Születési dátum<span class="required">*</span></label>
        <input type="date" id="birthDate" v-model="dataStore.userData.birthDate" required />

        <label for="gender">Nem<span class="required">*</span></label>
        <select id="gender" v-model="dataStore.userData.gender" required>
            <option value="" disabled selected>Válasszon nemet</option>
            <option value="male">Férfi</option>
            <option value="female">Nő</option>
        </select>

        <label for="height">Magasság (cm)<span class="required">*</span></label>
        <input type="number" id="height" v-model="dataStore.userData.height" min="50" max="250" required
            placeholder="pl.: 175" />

        <label for="weight">Súly (kg)<span class="required">*</span></label>
        <input type="number" id="weight" v-model="dataStore.userData.weight" min="1" max="500" required
            placeholder="pl.: 70" />

        <button type="button" @click="dataStore.showOptionalFields = !dataStore.showOptionalFields" class="toggle-extra">
            {{ dataStore.showOptionalFields ? 'További adatok elrejtése' : 'További adatok megadása' }}
        </button>

        <OptionalFields />

        <div class="privacy-checkbox">
            <input type="checkbox" id="privacyPolicy" v-model="privacyAccepted" required />
            <label for="privacyPolicy">
                Elfogadom az <span @click.stop.prevent="dataStore.showPrivacyModal = true"
                    class="privacy-link">adatvédelmi
                    irányelveket<span class="required">*</span></span>.
            </label>
        </div>

        <div class="buttons">
            <button v-if="!dataStore.thinking" type="submit" :class="['submit', { 'disabled': !privacyAccepted || dataStore.thinking }]"
                :disabled="!privacyAccepted || dataStore.thinking">Adatok
                beküldése</button>
            <button v-else type="button" @click="stopAnswering" class="abort">Ne válaszolj</button> 
            <button type="button" @click="exportData" class="export">Exportálás</button>
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