import type { BallLike } from "../components/BallCard";

const ICON_KEYWORDS: Record<string, string> = {
  fuego: "fire",
  burn: "fire",
  fire: "fire",
  sombra: "dark",
  oscuro: "dark",
  dark: "dark",
  veneno: "poison",
  poison: "poison",
  toxico: "poison",
  hielo: "ice",
  ice: "ice",
  freeze: "ice",
  luz: "light",
  light: "light",
  solar: "light",
  metal: "metal",
  iron: "metal",
  acero: "metal",
  espiritu: "ghost",
  espíritu: "ghost",
  ghost: "ghost",
  naturaleza: "nature",
  brood: "nature",
  mother: "nature",
  nature: "nature",
  viento: "wind",
  wind: "wind",
  aire: "wind",
  magia: "magic",
  laser: "magic",
  mágica: "magic",
};

const DEFAULT_ICON = "/icons/default.svg";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function findIconByKeywords(value?: string | null) {
  if (!value) return undefined;

  const normalized = value.toLowerCase();

  for (const [keyword, iconName] of Object.entries(ICON_KEYWORDS)) {
    if (normalized.includes(keyword)) {
      return `/icons/${iconName}.svg`;
    }
  }

  return undefined;
}

export function getBallIcon(ball: BallLike) {
  if (ball.imageUrl) return ball.imageUrl;
  if (ball.imagen) return ball.imagen;

  const byType = findIconByKeywords(ball.tipo || ball.type);
  if (byType) return byType;

  const byName = findIconByKeywords(ball.nombre || ball.name);
  if (byName) return byName;

  const slug = slugify(ball.nombre || ball.name || "");
  if (slug) {
    return `/icons/${slug}.svg`;
  }

  return DEFAULT_ICON;
}

export { DEFAULT_ICON };
