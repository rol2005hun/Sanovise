<template>
    <div class="right-click-menu" v-if="showMenu" :style="{ top: `${menuY}px`, left: `${menuX}px` }">
        <div class="menu-item">
            <input type="checkbox" id="checkbox1" v-model="dataStore.showForm" />
            <label for="checkbox1">{{ $t('components.clickMenu.showForm') }}</label>
        </div>
        <div class="menu-item">
            <input type="checkbox" id="checkbox2" v-model="dataStore.showChat" />
            <label for="checkbox2">{{ $t('components.clickMenu.showChat') }}</label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { dataStore } from '@/store';

const showMenu = ref(false);
const menuX = ref(0);
const menuY = ref(0);

function showContextMenu(event: MouseEvent) {
    event.preventDefault();
    showMenu.value = true;
    menuX.value = event.clientX;
    menuY.value = event.clientY;

    const windowWidth = window.innerWidth;
    const menuWidth = 200;
    if (menuX.value + menuWidth > windowWidth) {
        menuX.value -= menuWidth;
    }
}

function hideContextMenu(event: MouseEvent) {
    const isInsideMenu = (event.target as Element).closest('.right-click-menu');
    if (!isInsideMenu) {
        showMenu.value = false;
    }
}


onMounted(() => {
    document.body.addEventListener('contextmenu', showContextMenu);
    document.body.addEventListener('click', hideContextMenu);
});

onBeforeUnmount(() => {
    document.body.removeEventListener('contextmenu', showContextMenu);
    document.body.removeEventListener('click', hideContextMenu);
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/components/clickmenu.scss';
</style>