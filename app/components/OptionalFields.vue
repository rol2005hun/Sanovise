<template>
    <div v-show="dataStore.showOptionalFields" class="optional-fields">
        <label for="heartRate">{{ $t('components.optionalFields.heartRate') }}</label>
        <input type="number" id="heartRate" v-model="dataStore.userData.heartRate" min="30" max="250"
            :placeholder="$t('components.optionalFields.placeholderHeartRate')" />

        <label for="bloodPressure">{{ $t('components.optionalFields.bloodPressure') }}</label>
        <input type="text" id="bloodPressure" v-model="dataStore.userData.bloodPressure"
            :placeholder="$t('components.optionalFields.placeholderBloodPressure')" pattern="^\d{2,3}\/\d{2,3}$" />

        <label for="sports">{{ $t('components.optionalFields.sports') }}</label>
        <input type="text" id="sports" v-model="dataStore.userData.sports"
            :placeholder="$t('components.optionalFields.placeholderSports')" />

        <label for="medications">{{ $t('components.optionalFields.medications') }}</label>
        <input type="text" id="medications" v-model="dataStore.userData.medications"
            :placeholder="$t('components.optionalFields.placeholderMedications')" />

        <label for="chronicDiseases">{{ $t('components.optionalFields.chronicDiseases') }}</label>
        <input type="text" id="chronicDiseases" v-model="dataStore.userData.chronicDiseases"
            :placeholder="$t('components.optionalFields.placeholderChronicDiseases')" />

        <label for="allergies">{{ $t('components.optionalFields.allergies') }}</label>
        <input type="text" id="allergies" v-model="dataStore.userData.allergies"
            :placeholder="$t('components.optionalFields.placeholderAllergies')" />

        <label for="diet">{{ $t('components.optionalFields.diet') }}</label>
        <input type="text" id="diet" v-model="dataStore.userData.diet"
            :placeholder="$t('components.optionalFields.placeholderDiet')" />

        <label for="waterIntake">{{ $t('components.optionalFields.waterIntake') }}</label>
        <input type="number" id="waterIntake" v-model="dataStore.userData.waterIntake" min="0" max="50" step="0.1"
            :placeholder="$t('components.optionalFields.placeholderWaterIntake')" />

        <label for="familyHistory">{{ $t('components.optionalFields.familyHistory') }}</label>
        <input type="text" id="familyHistory" v-model="dataStore.userData.familyHistory"
            :placeholder="$t('components.optionalFields.placeholderFamilyHistory')" />

        <label for="smoking">{{ $t('components.optionalFields.smoking') }}</label>
        <select id="smoking" v-model="dataStore.userData.smoking">
            <option value="" disabled selected>{{ $t('components.optionalFields.smokingOptions.selectPlaceholder') }}
            </option>
            <option value="never">{{ $t('components.optionalFields.smokingOptions.never') }}</option>
            <option value="occasionally">{{ $t('components.optionalFields.smokingOptions.occasionally') }}</option>
            <option value="regularly">{{ $t('components.optionalFields.smokingOptions.regularly') }}</option>
        </select>

        <label for="alcohol">{{ $t('components.optionalFields.alcohol') }}</label>
        <select id="alcohol" v-model="dataStore.userData.alcohol">
            <option value="" disabled selected>{{ $t('components.optionalFields.alcoholOptions.selectPlaceholder') }}
            </option>
            <option value="never">{{ $t('components.optionalFields.alcoholOptions.never') }}</option>
            <option value="occasionally">{{ $t('components.optionalFields.alcoholOptions.occasionally') }}</option>
            <option value="regularly">{{ $t('components.optionalFields.alcoholOptions.regularly') }}</option>
        </select>

        <label for="sleep">{{ $t('components.optionalFields.sleep') }}</label>
        <input type="number" id="sleep" v-model="dataStore.userData.sleep" min="0" max="24" step="0.5"
            :placeholder="$t('components.optionalFields.placeholderSleep')" />

        <label for="physicalActivityLevel">{{ $t('components.optionalFields.physicalActivityLevel') }}</label>
        <input type="text" id="physicalActivityLevel" v-model="dataStore.userData.physicalActivityLevel"
            :placeholder="$t('components.optionalFields.placeholderPhysicalActivityLevel')" />

        <label for="workType">{{ $t('components.optionalFields.workType') }}</label>
        <input type="text" id="workType" v-model="dataStore.userData.workType"
            :placeholder="$t('components.optionalFields.placeholderWorkType')" />

        <label for="stressLevel">{{ $t('components.optionalFields.stressLevel') }}</label>
        <input type="text" id="stressLevel" v-model="dataStore.userData.stressLevel"
            :placeholder="$t('components.optionalFields.placeholderStressLevel')" />

        <label for="mentalHealth">{{ $t('components.optionalFields.mentalHealth') }}</label>
        <input type="text" id="mentalHealth" v-model="dataStore.userData.mentalHealth"
            :placeholder="$t('components.optionalFields.placeholderMentalHealth')" />

        <label for="cholesterolLevel">{{ $t('components.optionalFields.cholesterolLevel') }}</label>
        <input type="text" id="cholesterolLevel" v-model="dataStore.userData.cholesterolLevel"
            :placeholder="$t('components.optionalFields.placeholderCholesterolLevel')" />

        <label for="bloodSugarLevel">{{ $t('components.optionalFields.bloodSugarLevel') }}</label>
        <input type="text" id="bloodSugarLevel" v-model="dataStore.userData.bloodSugarLevel"
            :placeholder="$t('components.optionalFields.placeholderBloodSugarLevel')" />

        <label for="supplements">{{ $t('components.optionalFields.supplements') }}</label>
        <input type="text" id="supplements" v-model="dataStore.userData.supplements"
            :placeholder="$t('components.optionalFields.placeholderSupplements')" />

        <label for="vaccinations">{{ $t('components.optionalFields.vaccinations') }}</label>
        <input type="text" id="vaccinations" v-model="dataStore.userData.vaccinations"
            :placeholder="$t('components.optionalFields.placeholderVaccinations')" />

        <label for="reproductiveHealth">{{ $t('components.optionalFields.reproductiveHealth') }}</label>
        <input type="text" id="reproductiveHealth" v-model="dataStore.userData.reproductiveHealth"
            :placeholder="$t('components.optionalFields.placeholderReproductiveHealth')" />

        <label for="visionAndHearing">{{ $t('components.optionalFields.visionAndHearing') }}</label>
        <input type="text" id="visionAndHearing" v-model="dataStore.userData.visionAndHearing"
            :placeholder="$t('components.optionalFields.placeholderVisionAndHearing')" />

        <label for="sleepQuality">{{ $t('components.optionalFields.sleepQuality') }}</label>
        <input type="text" id="sleepQuality" v-model="dataStore.userData.sleepQuality"
            :placeholder="$t('components.optionalFields.placeholderSleepQuality')" />

        <label for="medicalRecords">{{ $t('components.optionalFields.medicalRecords') }}</label>
        <textarea id="medicalRecords" v-model="dataStore.userData.symptoms"
            :placeholder="$t('components.optionalFields.placeholderMedicalRecords')"></textarea>

        <label for="medicalHistory">{{ $t('components.optionalFields.medicalHistory') }}</label>
        <textarea id="medicalHistory" v-model="dataStore.userData.medicalHistory"
            :placeholder="$t('components.optionalFields.placeholderMedicalHistory')"></textarea>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/optionalfields.scss';
</style>