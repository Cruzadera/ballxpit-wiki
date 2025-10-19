import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CharacterCard, { Character } from "../../../components/wiki/CharacterCard";
import WikiBreadcrumb from "../../../components/wiki/WikiBreadcrumb";
import WikiSection from "../../../components/wiki/WikiSection";

export default function CharactersList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    setLoading(true);
    fetch(`${apiUrl}/characters`)
      .then((res) => res.json() as Promise<Character[]>)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.slug.localeCompare(b.slug));
        setCharacters(sorted);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching characters", error);
        setLoading(false);
      });
  }, [i18n.language]);

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return characters;
    }

    const filtered = characters.filter((character) => {
      const name = i18n.language.startsWith("es") ? character.name_es : character.name_en;
      const short = i18n.language.startsWith("es") ? character.short_es : character.short_en;
      return name.toLowerCase().includes(query) || short.toLowerCase().includes(query);
    });

    return [...filtered].sort((a, b) => {
      const nameA = i18n.language.startsWith("es") ? a.name_es : a.name_en;
      const nameB = i18n.language.startsWith("es") ? b.name_es : b.name_en;
      return nameA.localeCompare(nameB);
    });
  }, [characters, search, i18n.language]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <WikiBreadcrumb items={[{ label: "Wiki", to: "/" }, { label: t("characters") }]} />

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("characters")}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {i18n.language.startsWith("es")
              ? "Descubre los personajes jugables y sus rasgos únicos."
              : "Discover the playable characters and their unique traits."}
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 w-full sm:w-64 bg-white/90 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </header>

      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300 py-20">{t("detailLoading")}</div>
      ) : filteredCharacters.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300 py-20">{t("noResults")}</div>
      ) : (
        <WikiSection title={t("characters")} variant="plain">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <CharacterCard key={character.slug} character={character} />
            ))}
          </div>
        </WikiSection>
      )}
    </div>
  );
}
