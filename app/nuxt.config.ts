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
      { code: 'hu-HU', name: 'Magyar', iso: 'hu-HU', file: 'hu-HU.json' },
      { code: 'es-ES', name: 'Español (España)', iso: 'es-ES', file: 'es-ES.json' },
      { code: 'fr-FR', name: 'Français', iso: 'fr-FR', file: 'fr-FR.json' },
      { code: 'de-DE', name: 'Deutsch', iso: 'de-DE', file: 'de-DE.json' },
      { code: 'ru-RU', name: 'Русский', iso: 'ru-RU', file: 'ru-RU.json' },
      { code: 'zh-CN', name: '中文 (简体)', iso: 'zh-CN', file: 'zh-CN.json' },
      { code: 'ar-SA', name: 'العربية', iso: 'ar-SA', file: 'ar-SA.json' },
      { code: 'hi-IN', name: 'हिन्दी', iso: 'hi-IN', file: 'hi-IN.json' },
      { code: 'ro-RO', name: 'Română', iso: 'ro-RO', file: 'ro-RO.json' },
      { code: 'pl-PL', name: 'Polski', iso: 'pl-PL', file: 'pl-PL.json' },
      { code: 'it-IT', name: 'Italiano', iso: 'it-IT', file: 'it-IT.json' }
    ],
    defaultLocale: 'en-US',
    langDir: '../locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      redirectOn: 'all'
    },
    compilation: {
      strictMessage: false
    }
  }
});