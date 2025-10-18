import ballsTranslations from '../i18n/balls.json';
import i18n from '../i18n';

export const translateBallName = (name?: string): string => {
  if (!name) return '';
  const lang = i18n.language.startsWith('es') ? 'es' : 'en';
  const translations = ballsTranslations as Record<string, Record<string, string>>;
  return translations[lang]?.[name] || name;
};
