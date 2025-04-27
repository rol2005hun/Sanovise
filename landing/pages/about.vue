<template>
    <div class="about">
        <div class="description">
            <p>{{ $t('pages.about.description') }}</p>
        </div>

        <div class="goal">
            <h2>{{ $t('pages.about.goal') }}</h2>
            <p>{{ $t('pages.about.goalText') }}</p>
        </div>

        <div class="functions">
            <h2>{{ $t('pages.about.features') }}</h2>
            <ul>
                <li v-for="item in $tm('pages.about.featuresList')" :key="item">
                    {{ $rt(item) }}</li>
            </ul>
        </div>

        <div class="how-to">
            <h2>{{ $t('pages.about.howItWorks') }}</h2>
            <ol>
                <li v-for="item in $tm('pages.about.howItWorksSteps')" :key="item"
                    v-html="$rt(item)"></li>
            </ol>
        </div>

        <div class="why-us">
            <h2>{{ $t('pages.about.whyChooseUs') }}</h2>
            <p>{{ $t('pages.about.whyChooseUsText') }}</p>
            <p>{{ $t('pages.about.thankYou') }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use "@/assets/styles/pages/about.scss";
</style>
