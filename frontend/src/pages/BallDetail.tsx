import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { BallLike } from "../components/BallCard";
import { getIcon } from "../utils/getBallIcon";
import { translateBallName } from "../utils/translateBall";

type FusionResult = {
  id: number;
  name?: string | null;
  nombre?: string | null;
};

type FusionInput = {
  id: number;
  name?: string | null;
  nombre?: string | null;
};

type RelatedBall = {
  id: number;
  name?: string | null;
  nombre?: string | null;
};

type EvolutionFormula = {
  resultado: string;
  componentes: string[];
};

type FusionRecipe = {
  id: number;
  result: FusionResult;
  inputs: FusionInput[];
};

type BallDetailData = BallLike & {
  description?: string | null;
  descripcion?: string | null;
  tipo?: string | null;
  fusionInputs?: FusionRecipe[];
  fusionResults?: FusionRecipe[];
  componentes?: FusionInput[];
  components?: FusionInput[];
  fusionesRelacionadas?: RelatedBall[];
  evolucionesRelacionadas?: EvolutionFormula[];
};

export default function BallDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [ball, setBall] = useState<BallDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    fetch(`${apiUrl}/balls/${id}`)
      .then((res) => res.json())
      .then((data: BallDetailData) => {
        setBall(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ball:", err);
        setLoading(false);
      });
  }, [id, i18n.language]);

  const rawName = ball?.nombre || ball?.name || t("unknownBallName");
  const displayName = useMemo(
    () => translateBallName(rawName),
    [rawName, i18n.language]
  );

  const rawDescription =
    ball?.descripcion || ball?.description || t("detailDescriptionFallback");
  const description = useMemo(
    () => translateBallName(rawDescription),
    [rawDescription, i18n.language]
  );

  const componentList = useMemo(
    () => ball?.componentes || ball?.components || [],
    [ball]
  );

  const relatedFusions = useMemo(
    () => ball?.fusionesRelacionadas || [],
    [ball]
  );

  const relatedEvolutions = useMemo(
    () => ball?.evolucionesRelacionadas || [],
    [ball]
  );

  const iconSrc = getIcon(ball?.nombre || ball?.name || "");

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">{t("detailLoading")}</p>
      </div>
    );
  }

  if (!ball) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">{t("detailNotFound")}</p>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-indigo-600 dark:text-indigo-300 hover:underline font-medium">
          {t("detailBack")}
        </Link>
      </div>

      <div className="rounded-3xl bg-white/80 dark:bg-gray-900/60 shadow-xl border border-white/40 dark:border-gray-700/40 backdrop-blur p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={iconSrc}
            alt={displayName}
            className="w-40 h-40 object-contain mb-4"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{displayName}</h2>
          <p className="mt-4 text-base text-gray-700 dark:text-gray-300 max-w-2xl">{description}</p>
        </div>

        {ball.tipo === "pura" && (
          <p className="text-gray-400 dark:text-gray-500 mt-4 italic">{t("pureBall")}</p>
        )}

        {ball.tipo === "fusion" && componentList.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100">
              <span role="img" aria-hidden="true">🧩</span>
              {t("components")}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {componentList.map((comp, index) => (
                <Link
                  key={comp.id ?? index}
                  to={typeof comp.id === "number" ? `/balls/${comp.id}` : "#"}
                  className="bg-gray-800/60 dark:bg-gray-700/50 text-indigo-300 hover:text-indigo-100 px-3 py-1 rounded-xl text-sm font-medium hover:underline transition"
                >
                  {translateBallName(comp.nombre || comp.name || "?")}
                </Link>
              ))}
            </div>
          </div>
        )}

        {ball.tipo === "evolucion" && componentList.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100">
              <span role="img" aria-hidden="true">🔥</span>
              {t("evolvesFrom")}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {componentList.map((comp, index) => (
                <Link
                  key={comp.id ?? index}
                  to={typeof comp.id === "number" ? `/balls/${comp.id}` : "#"}
                  className="bg-gray-800/60 dark:bg-gray-700/50 text-indigo-300 hover:text-indigo-100 px-3 py-1 rounded-xl text-sm font-medium hover:underline transition"
                >
                  {translateBallName(comp.nombre || comp.name || "?")}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">
            {t("relatedFusions")}
          </h3>
          {relatedFusions.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedFusions.map((fusion) => (
                <Link
                  key={fusion.id}
                  to={`/balls/${fusion.id}`}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/70 shadow border border-white/30 dark:border-gray-700/40 text-center hover:shadow-lg transition"
                >
                  {translateBallName(fusion.nombre || fusion.name || "?")}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("relatedFusionsEmpty")}
            </p>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2 text-gray-900 dark:text-gray-100">
            <span role="img" aria-hidden="true">
              💥
            </span>
            {t("relatedEvolutions")}
          </h3>
          {relatedEvolutions.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {relatedEvolutions.map((evo, index) => {
                const translatedComponents = (evo.componentes ?? []).map((componento) =>
                  translateBallName(componento)
                );
                const formula = translatedComponents.length
                  ? translatedComponents.join(" + ")
                  : displayName;

                return (
                  <div
                    key={`${evo.resultado}-${evo.componentes?.join('-') ?? index}`}
                    className="bg-gray-800/60 dark:bg-gray-700/50 rounded-xl p-3 text-center text-gray-200"
                  >
                    <span className="font-medium">{formula}</span>{" "}
                    → <strong>{translateBallName(evo.resultado)}</strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("relatedEvolutionsEmpty")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
