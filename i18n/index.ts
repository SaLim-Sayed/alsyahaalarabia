import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

import ar from './locales/ar.json';
import en from './locales/en.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
};

// Detect system language
const systemLanguage = Localization.getLocales()[0].languageCode ?? 'ar';
// Fallback to 'ar' since it's the primary market
const defaultLanguage = ['ar', 'en'].includes(systemLanguage) ? systemLanguage : 'ar';

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

// Handle RTL
const isRTL = i18n.language === 'ar';
if (I18nManager.isRTL !== isRTL) {
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
}

export default i18n;
