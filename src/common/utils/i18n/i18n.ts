import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export interface I18nConfig {
  realm: string;
  defaultLanguage?: string;
  fallbackLanguage?: string;
  loader?: (realm: string, lang: string) => Promise<Record<string, string>>;
  staticTranslations?: Record<string, Record<string, string>>;
}

/**
 * Initialize i18n with custom configuration
 * Supports both API-based and static JSON translations
 */
export const initI18n = async (config: I18nConfig) => {
  const {
    realm,
    defaultLanguage = 'en',
    fallbackLanguage = 'en',
    loader,
    staticTranslations,
  } = config;

  const storedLanguage = localStorage.getItem('language') || defaultLanguage;

  await i18n
    .use(initReactI18next)
    .init({
      fallbackLng: fallbackLanguage,
      lng: storedLanguage,
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },

      resources: staticTranslations ? 
        Object.entries(staticTranslations).reduce((acc, [lang, translations]) => {
          acc[lang] = { translation: translations };
          return acc;
        }, {} as Record<string, { translation: Record<string, string> }>) 
        : undefined,

      react: {
        useSuspense: false,
      },
    });

  // If using API loader, set up custom backend
  if (loader && !staticTranslations) {
    // Load initial language
    try {
      const translations = await loader(realm, storedLanguage);
      i18n.addResourceBundle(storedLanguage, 'translation', translations, true, true);
    } catch (error) {
      console.error(`Failed to load translations for ${storedLanguage}:`, error);
    }

    // Override changeLanguage to load from API
    const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
    i18n.changeLanguage = async (lang: string) => {
      try {
        const translations = await loader(realm, lang);
        i18n.addResourceBundle(lang, 'translation', translations, true, true);
        return originalChangeLanguage(lang);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        return originalChangeLanguage(lang);
      }
    };
  }

  return i18n;
};

export default i18n;
