// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: 'Sanovise - App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo.png' }
      ],
      script: [
        { src: 'https://kit.fontawesome.com/33f8d9654f.js', crossorigin: 'anonymous' }
      ]
    }
  },

  modules: ['@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en-US', name: 'English (United States)', iso: 'en-US', file: 'en-US.json' },
      { code: 'hu-HU', name: 'Magyar', iso: 'hu-HU', file: 'hu-HU.json' }
    ],
    defaultLocale: 'en-US',
    lazy: true,
    langDir: '../locales',
    strategy: 'no_prefix',
    bundle: {
      optimizeTranslationDirective: false
    },
    detectBrowserLanguage: {
      redirectOn: 'all'
    },
    compilation: {
      strictMessage: false
    }
  }
});