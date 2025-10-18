import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BallCard, { BallLike } from "./BallCard";
import { translateBallName } from "../utils/translateBall";

type BallSummary = BallLike & {
  descripcion?: string | null;
  description?: string | null;
  tipo?: string | null;
};

export default function BallGrid() {
  const [pureBalls, setPureBalls] = useState<BallSummary[]>([]);
  const [fusionBalls, setFusionBalls] = useState<BallSummary[]>([]);
  const [evolutionBalls, setEvolutionBalls] = useState<BallSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    Promise.all([
      fetch(`${apiUrl}/balls/puras`).then((res) => res.json() as Promise<BallSummary[]>),
      fetch(`${apiUrl}/balls/fusions`).then((res) => res.json() as Promise<BallSummary[]>),
      fetch(`${apiUrl}/balls/evolutions`).then((res) => res.json() as Promise<BallSummary[]>)
    ])
      .then(([puras, fusiones, evoluciones]) => {
        const byName = (a: BallSummary, b: BallSummary) => {
          const aName = a.nombre || a.name || "";
          const bName = b.nombre || b.name || "";
          return aName.localeCompare(bName);
        };

        setPureBalls([...puras].sort(byName));
        setFusionBalls([...fusiones].sort(byName));
        setEvolutionBalls([...evoluciones].sort(byName));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching balls:", err);
        setLoading(false);
      });
  }, [i18n.language]);

  const filteredBalls = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filterBalls = (balls: BallSummary[]) =>
      balls.filter((ball) => {
        const originalName = (ball.nombre || ball.name || "").toLowerCase();
        const translatedName = translateBallName(ball.nombre || ball.name || "").toLowerCase();
        if (!normalizedQuery) {
          return true;
        }
        return (
          originalName.includes(normalizedQuery) ||
          translatedName.includes(normalizedQuery)
        );
      });

    return {
      puras: filterBalls(pureBalls),
      fusiones: filterBalls(fusionBalls),
      evoluciones: filterBalls(evolutionBalls)
    };
  }, [pureBalls, fusionBalls, evolutionBalls, query, i18n.language]);

  const hasResults =
    filteredBalls.puras.length > 0 ||
    filteredBalls.fusiones.length > 0 ||
    filteredBalls.evoluciones.length > 0;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">{t("loadingBalls")}</p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 w-full sm:w-1/2 bg-white/90 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {!hasResults ? (
        <p className="text-center text-gray-600 dark:text-gray-300">{t("noResults")}</p>
      ) : (
        <div className="flex flex-col gap-10">
          {filteredBalls.puras.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {t("pureBallsHeading")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBalls.puras.map((ball) => (
                  <BallCard key={`pure-${ball.id}`} ball={ball} />
                ))}
              </div>
            </div>
          )}

          {filteredBalls.fusiones.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {t("fusionBallsHeading")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBalls.fusiones.map((ball) => (
                  <BallCard key={`fusion-${ball.id}`} ball={ball} />
                ))}
              </div>
            </div>
          )}

          {filteredBalls.evoluciones.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {t("evolutionBallsHeading")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBalls.evoluciones.map((ball) => (
                  <BallCard key={`evolution-${ball.id}`} ball={ball} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
