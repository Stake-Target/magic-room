// https://i18n.nuxtjs.org/setup
export default {
  strategy: 'prefix_except_default',
  locales: [
    {
      code: 'en',
      name: 'English',
      key: 'en',
    }
  ],
  defaultLocale: 'en',
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'lang',
    onlyOnRoot: true // recommended
  },
  vueI18n: {
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    messages:{
      en: require('../assets/translates/en').default
    }
  }
}
