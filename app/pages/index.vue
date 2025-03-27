<template>
  <div class="form-card">
    <h2>Töltse fel adatait:</h2>

    <div class="file-upload" @dragover.prevent @drop="handleDrop">
      <input type="file" id="fileInput" @change="importData" accept="application/json" hidden />
      <label for="fileInput" class="upload-label">Válassz fájlt vagy húzd ide</label>
      <p v-if="fileName">Adatok: {{ fileName }}</p>
    </div>

    <form @submit.prevent="submitData" class="data-form">
      <p class="required-info">
        A<span class="required">*</span>-gal jelölt mezők kitöltése kötelező!
      </p>
      <label for="birthDate">Születési dátum<span class="required">*</span></label>
      <input type="date" id="birthDate" v-model="userData.birthDate" required />

      <label for="gender">Nem<span class="required">*</span></label>
      <select id="gender" v-model="userData.gender" required>
        <option value="" disabled selected>Válasszon nemet</option>
        <option value="male">Férfi</option>
        <option value="female">Nő</option>
      </select>

      <label for="height">Magasság (cm)<span class="required">*</span></label>
      <input type="number" id="height" v-model="userData.height" min="50" max="250" required placeholder="pl.: 175" />

      <label for="weight">Súly (kg)<span class="required">*</span></label>
      <input type="number" id="weight" v-model="userData.weight" min="1" max="500" required placeholder="pl.: 70" />

      <button type="button" @click="showExtraFields = !showExtraFields" class="toggle-extra">
        {{ showExtraFields ? 'További adatok elrejtése' : 'További adatok megadása' }}
      </button>

      <div v-if="showExtraFields" class="data-form">
        <label for="heartRate">Átlagos pulzus</label>
        <input type="number" id="heartRate" v-model="userData.heartRate" min="30" max="200" placeholder="pl.: 72" />

        <label for="bloodPressure">Vérnyomás (systole/diastole)</label>
        <input type="text" id="bloodPressure" v-model="userData.bloodPressure" placeholder="pl.: 120/80" />

        <label for="sports">Sporttevékenységek</label>
        <input type="text" id="sports" v-model="userData.sports" placeholder="pl.: futás, úszás, edzőterem" />

        <label for="medications">Rendszeresen szedett gyógyszerek</label>
        <input type="text" id="medications" v-model="userData.medications" placeholder="pl.: Aspirin, L-thyroxin" />

        <label for="chronicDiseases">Krónikus betegségek</label>
        <input type="text" id="chronicDiseases" v-model="userData.chronicDiseases" placeholder="pl.: cukorbetegség" />

        <label for="allergies">Allergiák</label>
        <input type="text" id="allergies" v-model="userData.allergies" placeholder="pl.: penicillin, pollen" />

        <label for="diet">Táplálkozási szokások</label>
        <input type="text" id="diet" v-model="userData.diet" placeholder="pl.: vegetáriánus, keto" />

        <label for="waterIntake">Napi vízfogyasztás (liter)</label>
        <input type="number" id="waterIntake" v-model="userData.waterIntake" min="0" max="10" step="0.1"
          placeholder="pl.: 2.5" />

        <label for="familyHistory">Családi kórtörténet</label>
        <input type="text" id="familyHistory" v-model="userData.familyHistory" placeholder="pl.: szívbetegségek" />

        <label for="smoking">Dohányzás</label>
        <select id="smoking" v-model="userData.smoking">
          <option value="" disabled selected>Nincs megadva</option>
          <option value="never">Soha</option>
          <option value="occasionally">Alkalmanként</option>
          <option value="regularly">Rendszeresen</option>
        </select>

        <label for="alcohol">Alkoholfogyasztás</label>
        <select id="alcohol" v-model="userData.alcohol">
          <option value="" disabled selected>Nincs megadva</option>
          <option value="never">Soha</option>
          <option value="occasionally">Alkalmanként</option>
          <option value="regularly">Rendszeresen</option>
        </select>

        <label for="sleep">Napi alvásidő (óra)</label>
        <input type="number" id="sleep" v-model="userData.sleep" min="0" max="24" step="0.5" placeholder="pl.: 7.5" />

        <label for="medicalRecords">Panaszok / tünetek</label>
        <textarea id="medicalRecords" v-model="userData.symptoms" placeholder="pl.: gyakori fejfájás"></textarea>

        <label for="medicalHistory">Betegéletút</label>
        <textarea id="medicalHistory" v-model="userData.medicalHistory" placeholder="Korábbi betegségek"></textarea>
      </div>

      <div class="privacy-checkbox">
        <input type="checkbox" id="privacyPolicy" v-model="privacyAccepted" required />
        <label for="privacyPolicy">
          Elfogadom az <span @click.stop.prevent="showPrivacyModal = true" class="privacy-link">adatvédelmi
            irányelveket<span class="required">*</span></span>.
        </label>
      </div>

      <div class="buttons">
        <button type="submit" :class="['submit', { 'disabled': !privacyAccepted }]" :disabled="!privacyAccepted">Adatok
          beküldése</button>
        <button type="button" @click="exportData" class="export">Exportálás JSON-be</button>
      </div>
    </form>

    <Privacymodal v-if="showPrivacyModal" :isOpen="showPrivacyModal" @close="showPrivacyModal = false" />

    <div v-if="serverResponse" class="response">
      <h3>Dr. Sanovise Mi válasza:</h3>
      <p>{{ serverResponse }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const userData = ref({
  birthDate: '',
  gender: '',
  height: '',
  weight: '',
  heartRate: '',
  bloodPressure: '',
  sports: '',
  medications: '',
  chronicDiseases: '',
  allergies: '',
  diet: '',
  waterIntake: '',
  familyHistory: '',
  smoking: '',
  alcohol: '',
  sleep: '',
  symptoms: '',
  medicalHistory: '',
});

const serverResponse = ref<string | null>(null);
const fileName = ref<string | null>(null);
const showExtraFields = ref(false);
const privacyAccepted = ref(false);
const showPrivacyModal = ref(false);

const submitData = async () => {
  try {
    serverResponse.value = 'Gondolkodik...';

    const response = await fetch('https://api.app.sanovise.ranzak.site/api/advice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(userData.value),
    });

    if (!response.body) {
      throw new Error('A válasz üres.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    serverResponse.value = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      serverResponse.value += decoder.decode(value, { stream: true });
    }
  } catch (error) {
    serverResponse.value = 'Hiba történt az adatok küldése közben.';
  }
}

const importData = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    fileName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        userData.value = JSON.parse(e.target?.result as string);
      } catch (error) {
        alert('Hibás JSON fájl!');
      }
    };
    reader.readAsText(file);
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files.length) {
    importData({ target: { files: event.dataTransfer.files } } as unknown as Event);
  }
}

const exportData = () => {
  const blob = new Blob([JSON.stringify(userData.value, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'user_data.json';
  link.click();
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/index.scss';
</style>