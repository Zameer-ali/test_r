import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const Languages = ['en-US', 'de'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: false,
    debug: false,
    whitelist: Languages,
    interpolation: {
      escapeValue: false,
    }
  });


export default i18n;