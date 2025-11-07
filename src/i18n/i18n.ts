import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: translations.en,
            },
        },
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
             escapeValue: false,
        },
    }).then(() => {});

export default i18n;

