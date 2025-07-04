import 'server-only';
import type { Locale } from '../../../i18n-config';
import type { Dictionary } from '../../types/dictionary';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default as Dictionary),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]();