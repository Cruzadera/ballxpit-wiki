import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import es from './es.json';

const detectLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const stored = window.localStorage.getItem('ballxpit-lang');
  if (stored) {
    return stored;
  }

  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('ballxpit-lang', lng);
    document.documentElement.lang = lng;
  }
});

document.documentElement.lang = i18n.language;

export default i18n;
