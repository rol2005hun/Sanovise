<template>
    <div class="modal-overlay" v-if="dataStore.showPrivacyModal">
        <div class="modal-content">
            <button class="close-button" @click="dataStore.showPrivacyModal = false">×</button>
            <h2>Adatvédelmi tájékoztató</h2>
            <p>
                Az Ön által megadott adatokat kizárólag az egészségügyi tanácsadó rendszer használja fel,
                és harmadik fél számára nem kerülnek továbbításra. Az adatait a rendszer nem tárolja, Ön
                kezelheti azokat, és mentheti le saját készülékére.
            </p>
            <p>
                Az adatvédelmi feltételek elfogadásával hozzájárul ahhoz, hogy rendszerünk az Ön által megadott
                információk alapján tanácsokat adjon.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';
</script>

<style scoped lang="scss">
@use '@/assets/styles/components/privacymodal.scss';
</style>