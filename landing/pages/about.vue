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
                <li v-for="(item, index) in $tm('pages.about.featuresList')" :key="index">{{
                    $t(`pages.about.featuresList[${index}]`) }}</li>
            </ul>
        </div>

        <div class="how-to">
            <h2>{{ $t('pages.about.howItWorks') }}</h2>
            <ol>
                <li v-for="(item, index) in $tm('pages.about.howItWorksSteps')" :key="index"
                    v-html="$t(`pages.about.howItWorksSteps[${index}]`)"></li>
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
