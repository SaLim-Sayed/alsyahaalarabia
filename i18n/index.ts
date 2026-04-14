import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

import ar from './locales/ar.json';
import en from './locales/en.json';
import kk from './locales/kk.json';
import ur from './locales/ur.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  kk: { translation: kk },
  ur: { translation: ur },
};

// Detect device language
const locales = Localization.getLocales();
const deviceLanguage = locales[0]?.languageCode || 'ar';
const supportedLanguages = ['ar', 'en', 'kk', 'ur'];
const defaultLanguage = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'ar';

// Initialize i18n without forcing RTL here to avoid race conditions with the Store
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false, 
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
