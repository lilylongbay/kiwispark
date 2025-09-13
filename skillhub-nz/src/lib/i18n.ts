import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const isServer = typeof window === 'undefined'

if (!isServer) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: 'zh', // default language
      fallbackLng: 'zh',
      debug: process.env.NODE_ENV === 'development',
      defaultNS: 'common',
      ns: ['common', 'nav', 'pages'],
      
      interpolation: {
        escapeValue: false, // React already does escaping
      },
      
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      
      detection: {
        order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['cookie', 'localStorage'],
        cookieOptions: {
          name: 'NEXT_LOCALE',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    })
}

export default i18n
