<template>
  <div class="form-card">
    <h2>Töltse fel adatait:</h2>

    <div class="file-upload" @dragover.prevent @drop="handleDrop">
      <input type="file" id="fileInput" @change="importData" accept="application/json" hidden />
      <label for="fileInput" class="upload-label">Válassz fájlt vagy húzd ide</label>
      <p v-if="fileName">Adatok: {{ fileName }}</p>
    </div>

    <form @submit.prevent="submitData">
      <label for="birthDate">Születési dátum<span class="required">*</span></label>
      <input type="date" id="birthDate" v-model="userData.birthDate" required />

      <label for="gender">Nem<span class="required">*</span></label>
      <select id="gender" v-model="userData.gender" required>
        <option value="male">Férfi</option>
        <option value="female">Nő</option>
      </select>

      <label for="height">Magasság (cm)<span class="required">*</span></label>
      <input type="number" id="height" v-model="userData.height" min="50" max="250" required />

      <label for="weight">Súly (kg)<span class="required">*</span></label>
      <input type="number" id="weight" v-model="userData.weight" min="1" max="500" required />

      <label for="heartRate">Átlagos pulzus</label>
      <input type="number" id="heartRate" v-model="userData.heartRate" min="30" max="200" />

      <label for="bloodPressure">Vérnyomás (systole/diastole)</label>
      <input type="text" id="bloodPressure" v-model="userData.bloodPressure"
        pattern="\b(8[0-9]|9[0-9]|1[0-9]{2}|200)\/(4[0-9]|[5-9][0-9]|1[0-4][0-9]|150)\b" />

      <label for="medicalRecords">Panaszok / tünetek</label>
      <textarea id="medicalRecords" v-model="userData.symptoms" minlength="30"></textarea>

      <label for="medicalHistory">Betegéletút</label>
      <textarea id="medicalHistory" v-model="userData.medicalHistory" minlength="30"></textarea>

      <div class="buttons">
        <button type="submit" class="submit">Adatok beküldése</button>
        <button type="button" @click="exportData" class="export">Exportálás JSON-be</button>
      </div>
    </form>

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
  symptoms: '',
  medicalHistory: '',
});

const serverResponse = ref<string | null>(null);
const fileName = ref<string | null>(null);

const submitData = async () => {
  try {
    const response = await fetch('http://localhost:2999/api/advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData.value),
    });
    serverResponse.value = await response.json().then(data => data.response);
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