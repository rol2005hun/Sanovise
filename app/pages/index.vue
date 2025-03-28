<template>
  <div class="form-card">
    <h2>Töltse fel adatait:</h2>

    <FileUpload />

    <UserForm />

    <PrivacyModal />

    <Response />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/index.scss';
</style>