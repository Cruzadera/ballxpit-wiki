import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export type Character = {
  id: number;
  slug: string;
  name_es: string;
  name_en: string;
  short_es: string;
  short_en: string;
  description_es: string;
  description_en: string;
  ball: string;
  trait_es: string;
  trait_en: string;
};

type CharacterCardProps = {
  character: Character;
};

export default function CharacterCard({ character }: CharacterCardProps) {
  const { i18n } = useTranslation();

  const displayName = useMemo(
    () => (i18n.language.startsWith("es") ? character.name_es : character.name_en),
    [character.name_en, character.name_es, i18n.language]
  );

  const displayShort = useMemo(
    () => (i18n.language.startsWith("es") ? character.short_es : character.short_en),
    [character.short_en, character.short_es, i18n.language]
  );

  return (
    <Link
      to={`/wiki/characters/${character.slug}`}
      className="group block bg-white/80 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700 rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="h-32 bg-gradient-to-br from-indigo-200/60 via-purple-200/40 to-indigo-100/40 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-indigo-800/40" />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {displayName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{displayShort}</p>
      </div>
    </Link>
  );
}
