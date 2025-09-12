import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/translation.json';
import ar from '../locales/ar/translation.json';

i18n
  .use(LanguageDetector) // 👈 add this
  .use(initReactI18next) // connect with React
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en', // if translation not found
    interpolation: {
      escapeValue: false, // react already escapes
    },
  });
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

export default i18n;

