<template>
    <div class="tos-container">
        <header class="tos-header">
            <h1>{{ $t('pages.terms.title') }}</h1>
            <p class="last-updated">{{ $t('pages.terms.lastUpdated', { date: lastUpdated }) }}</p>
        </header>

        <div class="tos-content">
            <section v-for="(item, index) in $tm('pages.terms.sections')" :key="index"
                class="tos-section">
                <h2>{{ $t(`pages.terms.sections[${index}].title`) }}</h2>
                <div>
                    <p v-for="(item2, index2) in $tm(`pages.terms.sections[${index}].content`)" :key="index2">
                        {{ $t(`pages.terms.sections[${index}].content[${index2}]`) }}
                    </p>
                </div>
            </section>

            <div class="tos-acceptance">
                <p v-for="(item, index) in $tm('pages.terms.acceptanceText')" :key="index">
                    {{ $t(`pages.terms.acceptanceText[${index}]`) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const lastUpdated = ref(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}));
</script>

<style lang="scss" scoped>
@use '@/assets/styles/pages/terms.scss';
</style>