import CoreMsApi from "@/common/utils/api/CoreMsApi";
import { TRANSLATION_MS_BASE_URL } from "@/translation/config";
import { HttpMethod } from "@/common/model/CoreMsApiModel";

const translationMsApi = new CoreMsApi({
  baseURL: TRANSLATION_MS_BASE_URL,
});

export interface TranslationMap {
  [key: string]: string;
}

/**
 * Fetch translations for a specific realm and language
 * @param realm - The realm (e.g., 'app', 'admin', 'public')
 * @param lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns Promise with translations map
 */
export const fetchTranslations = async (
  realm: string,
  lang: string
): Promise<TranslationMap> => {
  const response = await translationMsApi.apiRequest<TranslationMap>(
    HttpMethod.GET,
    `/api/translation/${realm}/${lang}`
  );

  if (response.result && response.response) {
    return response.response;
  }

  // Return empty object if fetch fails
  return {};
};

/**
 * Fetch available languages from backend
 * This should be implemented when backend provides a languages endpoint
 */
export const fetchAvailableLanguages = async (
  realm: string
): Promise<string[]> => {
  const response = await translationMsApi.apiRequest<string[]>(
    HttpMethod.GET,
    `/api/languages/${realm}`
  );

  if (response.result && response.response) {
    return response.response;
  }

  return [];
};
