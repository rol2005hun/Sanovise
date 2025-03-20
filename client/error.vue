<template>
    <div class="container">
        <Header />
        <div class="error">
            <div class="error-content">
                <h1 v-if="error?.statusCode === 404">404 - Az oldal nem található</h1>
                <h1 v-else>Valami váratlan hiba történt</h1>
                <p v-if="error?.statusCode === 404">Az oldal, amit keresett, nem található. Kérjük, ellenőrizze az URL-t,
                    vagy térjen vissza a <NuxtLink to="/" class="error-link">főoldalra</NuxtLink>.</p>
                <p v-else>
                    <span>Úgy tűnik, eltévedtél, és a digitális egészségügyi asszisztensünk is egy pillanatra elvesztette a
                        fonalat.</span>
                    <br />
                    <span>Ne aggódj! Tartsd meg a hidegvéred, és próbáld meg újra később. Ha biztosra akarsz menni, kérj
                        segítséget a <NuxtLink to="/contact" class="error-link">támogatói csapatunktól</NuxtLink>.</span>
                </p>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import Header from '@/components/header.vue';

const props = defineProps({
    error: Object as () => NuxtError
});
</script>

<style scoped lang="scss">
@use "@/assets/styles/error.scss";
</style>