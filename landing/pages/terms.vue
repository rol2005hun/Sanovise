<template>
    <div class="tos-container">
        <header class="tos-header">
            <h1>{{ $t('pages.terms.title') }}</h1>
            <p class="last-updated">{{ $t('pages.terms.lastUpdated', { date: lastUpdated }) }}</p>
        </header>

        <div class="tos-content">
            <section v-for="item in sections" :key="item" class="tos-section">
                <h2>{{ $rt(item.title) }}</h2>
                <div>
                    <template v-for="content in item.content" :key="content">
                        <ul v-if="content.list">
                            <li v-for="listItem in content.list" :key="listItem">
                                {{ $rt(listItem) }}
                            </li>
                        </ul>
                        <p v-else>
                            {{ $rt(content) }}
                        </p>
                    </template>
                </div>
            </section>

            <div class="tos-acceptance">
                <p v-for="item in $tm('pages.terms.acceptanceText')" :key="item">
                    {{ $rt(item) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const sections = computed(() => useI18n().tm('pages.terms.sections') as any[]);
const lastUpdated = ref(new Date('2025-04-27').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}));
</script>

<style lang="scss" scoped>
@use '@/assets/styles/pages/terms.scss';
</style>