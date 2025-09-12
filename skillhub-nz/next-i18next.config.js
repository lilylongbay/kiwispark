/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: {
    default: ['zh'],
  },
  debug: process.env.NODE_ENV === 'development',
  saveMissing: process.env.NODE_ENV === 'development',
  strictMode: true,
  serializeConfig: false,
  react: {
    useSuspense: false,
  },
}
