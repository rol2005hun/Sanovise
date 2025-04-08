<template>
    <div class="download-page">
        <header class="download-header container">
            <h1>{{ $t('pages.download.title') }}</h1>
            <p class="subtitle">{{ $t('pages.download.subtitle') }}</p>
        </header>

        <section class="download-grid container">
            <div class="download-column mobile-apps">
                <div class="column-header">
                    <h2>{{ $t('pages.download.mobile.title') }}</h2>
                </div>
                <p class="column-description">{{ $t('pages.download.mobile.description') }}</p>

                <div class="app-download-card">
                    <h3><span role="img" aria-label="Robot emoji"><i class="fa-brands fa-android"></i></span> {{
                        $t('pages.download.mobile.android.title')
                    }}</h3>
                    <p>{{ $t('pages.download.mobile.android.description') }}</p>
                    <a href="https://web.unideb.hu/rol2005hun/szakdoga/sanovise.apk" target="_blank"
                        rel="noopener noreferrer" class="btn-download store-link">
                        {{ $t('pages.download.mobile.android.button') }}
                    </a>
                </div>

                <div class="app-download-card">
                    <h3><span role="img" aria-label="Mobile phone emoji"><i class="fa-brands fa-apple"></i></span> {{
                        $t('pages.download.mobile.ios.title') }}</h3>
                    <p>{{ $t('pages.download.mobile.ios.description') }}</p>
                    <a href="javascript:void(0);" target="_blank" rel="noopener noreferrer"
                        class="btn-download store-link not-available" @click.prevent>
                        {{ $t('pages.download.mobile.ios.button') }}
                    </a>
                </div>
            </div>

            <div class="download-column web-app highlight">
                <div class="column-header">
                    <h2>{{ $t('pages.download.web.title') }}</h2>
                </div>
                <p class="column-description emphasis">{{ $t('pages.download.web.emphasis') }}</p>
                <p class="column-description">{{ $t('pages.download.web.description') }}</p>

                <div class="web-app-action">
                    <span class="emoji-large" role="img" aria-label="Rocket emoji">🚀</span>
                    <a href="https://app.sanovise.ranzak.site/" target="_blank" rel="noopener noreferrer"
                        class="btn-primary btn-large launch-button">
                        {{ $t('pages.download.web.launchButton') }}
                    </a>
                    <p class="web-benefits">{{ $t('pages.download.web.benefits') }}</p>
                </div>
            </div>

            <div class="download-column desktop-apps">
                <div class="column-header">
                    <h2>{{ $t('pages.download.desktop.title') }}</h2>
                </div>
                <p class="column-description">{{ $t('pages.download.desktop.description') }}</p>

                <div class="desktop-download-group">
                    <div class="desktop-option">
                        <span class="emoji-os" role="img" aria-label="Laptop computer emoji"><i
                                class="fa-brands fa-microsoft"></i></span>
                        <span class="os-name">{{ $t('pages.download.desktop.windows.title') }}</span>
                        <a href="javascript:void(0);" class="btn-secondary download-link not-available" @click.prevent download>
                            {{ $t('pages.download.desktop.downloadButton') }} <span role="img"
                                aria-label="Download symbol">📥</span>
                        </a>
                    </div>
                    <div class="desktop-option">
                        <span class="emoji-os" role="img" aria-label="Desktop computer emoji"><i
                                class="fa-brands fa-apple"></i></span>
                        <span class="os-name">{{ $t('pages.download.desktop.macos.title') }}</span>
                        <a href="javascript:void(0);" class="btn-secondary download-link not-available" @click.prevent download>
                            {{ $t('pages.download.desktop.downloadButton') }} <span role="img"
                                aria-label="Download symbol">📥</span>
                        </a>
                    </div>
                    <div class="desktop-option">
                        <span class="emoji-os" role="img" aria-label="Penguin emoji">🐧</span>
                        <span class="os-name">{{ $t('pages.download.desktop.linux.title') }}</span>
                        <a href="javascript:void(0);" class="btn-secondary download-link not-available" @click.prevent download>
                            {{ $t('pages.download.desktop.downloadButton') }} <span role="img"
                                aria-label="Download symbol">📥</span>
                        </a>
                    </div>
                    <p class="desktop-note">{{ $t('pages.download.desktop.note') }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '@/assets/styles/pages/download.scss';
</style>