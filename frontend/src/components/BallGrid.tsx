import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BallCard, { BallLike } from "./BallCard";

type BallSummary = BallLike & {
  descripcion?: string | null;
  description?: string | null;
};

export default function BallGrid() {
  const [balls, setBalls] = useState<BallSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    fetch(`${apiUrl}/balls`)
      .then((res) => res.json())
      .then((data: BallSummary[]) => {
        const sorted = data.sort((a, b) => {
          const aHasFusionResults = Array.isArray(a.fusionResults) && a.fusionResults.length > 0;
          const bHasFusionResults = Array.isArray(b.fusionResults) && b.fusionResults.length > 0;
          const aIsPure = Array.isArray(a.fusionResults) ? a.fusionResults.length === 0 : false;
          const bIsPure = Array.isArray(b.fusionResults) ? b.fusionResults.length === 0 : false;

          if (aIsPure && !bIsPure) return -1;
          if (!aIsPure && bIsPure) return 1;

          if (!aHasFusionResults && bHasFusionResults) return 1;
          if (aHasFusionResults && !bHasFusionResults) return -1;

          const aName = a.nombre || a.name || "";
          const bName = b.nombre || b.name || "";

          return aName.localeCompare(bName);
        });

        setBalls(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching balls:", err);
        setLoading(false);
      });
  }, []);

  const filteredBalls = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return balls.filter((ball) => {
      const displayName = (ball.nombre || ball.name || "").toLowerCase();
      return normalizedQuery ? displayName.includes(normalizedQuery) : true;
    });
  }, [balls, query]);

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

      {filteredBalls.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBalls.map((ball) => (
            <BallCard key={ball.id} ball={ball} />
          ))}
        </div>
      )}
    </section>
  );
}
