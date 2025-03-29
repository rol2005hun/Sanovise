<template>
  <footer class="app-footer">
    <div class="container">
      <a class="tos">{{ $t('components.footer.tos') }}</a>
      <p class="copy">{{ $t('components.footer.copyright') }}</p>
      <select id="language" v-model="language" class="language-select" title="language selector">
        <option v-for="locale in locales" :key="locale.code" :value="locale.code">
          {{ locale.code }}
        </option>
      </select>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { locales, locale, setLocale } = useI18n();

const language = computed({
  get: () => locale.value,
  set: (value) => {
    setLocale(value);
  }
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/footer.scss';
</style>