export type SupportedLanguage = 'en' | 'es';

export function resolveLanguage(header?: string): SupportedLanguage {
  if (!header) {
    return 'en';
  }

  return header.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function translateField(
  language: SupportedLanguage,
  englishValue?: string | null,
  spanishValue?: string | null
): string | null {
  const normalizedEnglish = englishValue ?? null;
  const normalizedSpanish = spanishValue ?? null;

  return language === 'es'
    ? normalizedSpanish ?? normalizedEnglish
    : normalizedEnglish ?? normalizedSpanish;
}
