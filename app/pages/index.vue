<template>
  <div class="form-card">
    <h2>{{ $t("pages.index.title") }}:</h2>

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