const DEFAULT_ICON = "/icons/default.svg";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const keywordMatches: { keywords: string[]; icon: string }[] = [
  { keywords: ["fuego", "burn", "fire"], icon: "/icons/fire.svg" },
  { keywords: ["oscuro", "dark"], icon: "/icons/dark.svg" },
  { keywords: ["veneno", "poison"], icon: "/icons/poison.svg" },
  { keywords: ["hielo", "freeze", "ice"], icon: "/icons/ice.svg" },
  { keywords: ["luz", "light"], icon: "/icons/light.svg" },
  { keywords: ["metal", "iron"], icon: "/icons/metal.svg" },
  { keywords: ["fantasma", "espiritu", "espíritu", "ghost"], icon: "/icons/ghost.svg" },
  { keywords: ["madre", "nature", "brood"], icon: "/icons/nature.svg" },
  { keywords: ["viento", "wind"], icon: "/icons/wind.svg" },
  { keywords: ["laser", "magia", "magic"], icon: "/icons/magic.svg" }
];

export const getIcon = (name: string) => {
  const normalized = normalize(name).trim();

  if (!normalized) {
    return DEFAULT_ICON;
  }

  for (const match of keywordMatches) {
    if (match.keywords.some((keyword) => normalized.includes(keyword))) {
      return match.icon;
    }
  }

  return DEFAULT_ICON;
};

export { DEFAULT_ICON };
