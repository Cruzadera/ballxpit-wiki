import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WikiBreadcrumb from "../../../components/wiki/WikiBreadcrumb";
import WikiSection from "../../../components/wiki/WikiSection";
import WikiInfobox from "../../../components/wiki/WikiInfobox";
import type { Character } from "../../../components/wiki/CharacterCard";

type FetchState = "idle" | "loading" | "error";

export default function CharacterDetail() {
  const { slug = "" } = useParams();
  const { t, i18n } = useTranslation();
  const [character, setCharacter] = useState<Character | null>(null);
  const [state, setState] = useState<FetchState>("idle");

  useEffect(() => {
    if (!slug) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    setState("loading");

    fetch(`${apiUrl}/characters/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Character ${slug} not found`);
        }
        return res.json() as Promise<Character>;
      })
      .then((data) => {
        setCharacter(data);
        setState("idle");
      })
      .catch((error) => {
        console.error("Error fetching character", error);
        setState("error");
      });
  }, [slug, i18n.language]);

  const displayName = useMemo(() => {
    if (!character) {
      return "";
    }
    return i18n.language.startsWith("es") ? character.name_es : character.name_en;
  }, [character, i18n.language]);

  const displayShort = useMemo(() => {
    if (!character) {
      return "";
    }
    return i18n.language.startsWith("es") ? character.short_es : character.short_en;
  }, [character, i18n.language]);

  const displayDescription = useMemo(() => {
    if (!character) {
      return "";
    }
    return i18n.language.startsWith("es") ? character.description_es : character.description_en;
  }, [character, i18n.language]);

  const displayTrait = useMemo(() => {
    if (!character) {
      return "";
    }
    return i18n.language.startsWith("es") ? character.trait_es : character.trait_en;
  }, [character, i18n.language]);

  if (state === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-600 dark:text-gray-300">
        {t("detailLoading")}
      </div>
    );
  }

  if (state === "error" || !character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-600 dark:text-gray-300 space-y-4">
        <p>{t("detailNotFound")}</p>
        <Link to="/wiki/characters" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          {t("detailBack")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <WikiBreadcrumb
        items={[
          { label: "Wiki", to: "/" },
          { label: t("characters"), to: "/wiki/characters" },
          { label: displayName }
        ]}
      />

      <article className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <header className="space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{displayName}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{displayShort}</p>
          </header>

          <WikiSection title={t("description")}>
            <p>{displayDescription}</p>
          </WikiSection>

          <WikiSection title={t("stats")}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t("ball")}
                </dt>
                <dd className="text-base text-gray-900 dark:text-gray-100">{character.ball}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {t("trait")}
                </dt>
                <dd className="text-base text-gray-900 dark:text-gray-100">{displayTrait}</dd>
              </div>
            </dl>
          </WikiSection>

          <WikiSection title={t("related_links")}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {i18n.language.startsWith("es")
                ? "Próximamente: enlaces a historias, fusiones y estrategias."
                : "Coming soon: links to lore, fusions, and strategies."}
            </p>
          </WikiSection>
        </div>

        <WikiInfobox
          title={displayName}
          subtitle={displayShort}
          items={[
            { label: t("ball"), value: character.ball },
            { label: t("trait"), value: displayTrait }
          ]}
        />
      </article>
    </div>
  );
}
