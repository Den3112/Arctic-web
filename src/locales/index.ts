import { en } from './en';
import { uk } from './uk';

export const translations = {
  en,
  uk,
};

export type Locale = keyof typeof translations;
export type TranslationKey = typeof en;
