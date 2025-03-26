<template>
  <div class="container">
    <section class="hero">
      <div class="hero-content container">
        <h2>Digitális egészségügyi asszisztens</h2>
        <p>Fedezd fel részletesen egészségügyi adataid és ajánlásaink segítségével hozd meg a legjobb döntéseket!</p>
        <a href="https://app.sanovise.ranzak.site/" class="btn-primary">Kezdd el</a>
      </div>
    </section>
    
    <section class="features container">
      <div class="feature-card" v-for="(feature, index) in features" :key="index">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const features = ref([
  { title: 'Részletes elemzés', description: 'Személyre szabott egészségügyi tanácsadás a te adataid alapján.' },
  { title: 'Adatbiztonság', description: 'Adatvédelmi protokollok és titkosítás minden szinten.' },
  { title: 'Multi-platform', description: 'Webes, asztali és mobil eszközökön egyaránt elérhető.' },
]);
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/index.scss';
</style>