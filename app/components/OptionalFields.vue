<template>
    <div v-if="dataStore.showOptionalFields" class="optional-fields">
        <label for="heartRate">Átlagos pulzus</label>
        <input type="number" id="heartRate" v-model="dataStore.userData.heartRate" min="30" max="200"
            placeholder="pl.: 72" />

        <label for="bloodPressure">Vérnyomás (systole/diastole)</label>
        <input type="text" id="bloodPressure" v-model="dataStore.userData.bloodPressure" placeholder="pl.: 120/80" />

        <label for="sports">Sporttevékenységek</label>
        <input type="text" id="sports" v-model="dataStore.userData.sports" placeholder="pl.: futás, úszás, edzőterem" />

        <label for="medications">Rendszeresen szedett gyógyszerek</label>
        <input type="text" id="medications" v-model="dataStore.userData.medications"
            placeholder="pl.: Aspirin, L-thyroxin" />

        <label for="chronicDiseases">Krónikus betegségek</label>
        <input type="text" id="chronicDiseases" v-model="dataStore.userData.chronicDiseases"
            placeholder="pl.: cukorbetegség" />

        <label for="allergies">Allergiák</label>
        <input type="text" id="allergies" v-model="dataStore.userData.allergies"
            placeholder="pl.: penicillin, pollen" />

        <label for="diet">Táplálkozási szokások</label>
        <input type="text" id="diet" v-model="dataStore.userData.diet" placeholder="pl.: vegetáriánus, keto" />

        <label for="waterIntake">Napi vízfogyasztás (liter)</label>
        <input type="number" id="waterIntake" v-model="dataStore.userData.waterIntake" min="0" max="10" step="0.1"
            placeholder="pl.: 2.5" />

        <label for="familyHistory">Családi kórtörténet</label>
        <input type="text" id="familyHistory" v-model="dataStore.userData.familyHistory"
            placeholder="pl.: szívbetegségek" />

        <label for="smoking">Dohányzás</label>
        <select id="smoking" v-model="dataStore.userData.smoking">
            <option value="" disabled selected>Nincs megadva</option>
            <option value="never">Soha</option>
            <option value="occasionally">Alkalmanként</option>
            <option value="regularly">Rendszeresen</option>
        </select>

        <label for="alcohol">Alkoholfogyasztás</label>
        <select id="alcohol" v-model="dataStore.userData.alcohol">
            <option value="" disabled selected>Nincs megadva</option>
            <option value="never">Soha</option>
            <option value="occasionally">Alkalmanként</option>
            <option value="regularly">Rendszeresen</option>
        </select>

        <label for="sleep">Napi alvásidő (óra)</label>
        <input type="number" id="sleep" v-model="dataStore.userData.sleep" min="0" max="24" step="0.5"
            placeholder="pl.: 7.5" />

        <label for="medicalRecords">Panaszok / tünetek</label>
        <textarea id="medicalRecords" v-model="dataStore.userData.symptoms"
            placeholder="pl.: gyakori fejfájás"></textarea>

        <label for="medicalHistory">Betegéletút</label>
        <textarea id="medicalHistory" v-model="dataStore.userData.medicalHistory"
            placeholder="Korábbi betegségek"></textarea>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/optionalfields.scss';
</style>