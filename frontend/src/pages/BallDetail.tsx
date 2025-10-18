import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { BallLike } from "../components/BallCard";
import { getIcon } from "../utils/getBallIcon";

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

type FusionRecipe = {
  id: number;
  result: FusionResult;
  inputs: FusionInput[];
};

type BallDetailData = BallLike & {
  description?: string | null;
  descripcion?: string | null;
  fusionInputs?: FusionRecipe[];
};

export default function BallDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
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
  }, [id]);

  const displayName = useMemo(
    () => ball?.nombre || ball?.name || t("unknownBallName"),
    [ball?.nombre, ball?.name, t]
  );

  const description =
    ball?.descripcion || ball?.description || t("detailDescriptionFallback");

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

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">
            {t("detailFusionsTitle")}
          </h3>
          {ball.fusionInputs?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ball.fusionInputs.map((fusion) => {
                const resultName = fusion.result.nombre || fusion.result.name || "?";
                const inputNames = fusion.inputs
                  .map((input) => input.nombre || input.name || "?")
                  .join(" + ");
                return (
                  <div
                    key={fusion.id}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/70 shadow border border-white/30 dark:border-gray-700/40 text-center"
                  >
                    {inputNames} → <strong>{resultName}</strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t("detailFusionsEmpty")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
