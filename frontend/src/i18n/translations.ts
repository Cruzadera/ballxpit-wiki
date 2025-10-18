import { useMemo } from "react";
import { SupportedLang, useLanguage } from "../context/LanguageContext";

type TranslationKeys =
  | "heroTitle"
  | "heroSubtitle"
  | "searchPlaceholder"
  | "loadingBalls"
  | "noResults"
  | "cardFallbackDescription"
  | "cardCallToAction"
  | "darkModeLight"
  | "darkModeDark"
  | "detailBack"
  | "detailLoading"
  | "detailNotFound"
  | "detailLevelLabel"
  | "detailTypeLabel"
  | "detailDescriptionFallback"
  | "detailFusionsTitle"
  | "detailFusionsEmpty";

type TranslationDictionary = Record<SupportedLang, Record<TranslationKeys, string>>;

const translations: TranslationDictionary = {
  es: {
    heroTitle: "Explora las bolas",
    heroSubtitle: "Busca por nombre o descubre sus fusiones y evoluciones.",
    searchPlaceholder: "Buscar por nombre…",
    loadingBalls: "Cargando bolas…",
    noResults: "No se encontraron bolas que coincidan con la búsqueda.",
    cardFallbackDescription: "Haz clic para ver fusiones y evoluciones relacionadas.",
    cardCallToAction: "Haz clic para ver más detalles.",
    darkModeLight: "☀️ Modo claro",
    darkModeDark: "🌙 Modo oscuro",
    detailBack: "← Volver a la lista",
    detailLoading: "Cargando…",
    detailNotFound: "Bola no encontrada",
    detailLevelLabel: "Nivel",
    detailTypeLabel: "Tipo",
    detailDescriptionFallback: "No hay descripción disponible.",
    detailFusionsTitle: "🔗 Fusiones relacionadas",
    detailFusionsEmpty: "No hay fusiones registradas para esta bola.",
  },
  en: {
    heroTitle: "Explore the balls",
    heroSubtitle: "Search by name or discover their fusions and evolutions.",
    searchPlaceholder: "Search by name…",
    loadingBalls: "Loading balls…",
    noResults: "No balls matched your search.",
    cardFallbackDescription: "Click to discover related fusions and evolutions.",
    cardCallToAction: "Click to view more details.",
    darkModeLight: "☀️ Light mode",
    darkModeDark: "🌙 Dark mode",
    detailBack: "← Back to the list",
    detailLoading: "Loading…",
    detailNotFound: "Ball not found",
    detailLevelLabel: "Level",
    detailTypeLabel: "Type",
    detailDescriptionFallback: "No description available.",
    detailFusionsTitle: "🔗 Related fusions",
    detailFusionsEmpty: "No fusions are registered for this ball.",
  },
};

export function useTranslations() {
  const { lang } = useLanguage();

  return useMemo(() => translations[lang], [lang]);
}
