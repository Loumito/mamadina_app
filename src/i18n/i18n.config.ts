import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import fr from './fr.json';
import ar from './ar.json';

const resources = {
  fr: {
    translation: fr,
  },
  ar: {
    translation: ar,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'fr', // Langue par défaut
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
