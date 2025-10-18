import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { BallLike } from "../components/BallCard";
import { useLanguage, type SupportedLang } from "../context/LanguageContext";
import { useTranslations } from "../i18n/translations";
import { DEFAULT_ICON, getBallIcon } from "../utils/getBallIcon";

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
  const { setLang } = useLanguage();
  const texts = useTranslations();
  const [ball, setBall] = useState<BallDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>(DEFAULT_ICON);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    fetch(`${apiUrl}/balls/${id}`)
      .then((res) => res.json())
      .then((data: BallDetailData) => {
        setBall(data);
        const detectedLang: SupportedLang = data?.nombre ? "es" : "en";
        setLang(detectedLang);
        setImageSrc(getBallIcon(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ball:", err);
        setLoading(false);
      });
  }, [id, setLang]);

  useEffect(() => {
    if (ball) {
      setImageSrc(getBallIcon(ball));
    }
  }, [ball]);

  const displayName = useMemo(
    () => ball?.nombre || ball?.name || "Bola misteriosa",
    [ball?.nombre, ball?.name]
  );

  const displayLevel = ball?.level ?? ball?.nivel;
  const displayType = ball?.type || ball?.tipo;
  const description =
    ball?.descripcion || ball?.description || texts.detailDescriptionFallback;

  const handleImageError = () => {
    if (imageSrc !== DEFAULT_ICON) {
      setImageSrc(DEFAULT_ICON);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">{texts.detailLoading}</p>
      </div>
    );
  }

  if (!ball) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">{texts.detailNotFound}</p>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-indigo-600 dark:text-indigo-300 hover:underline font-medium">
          {texts.detailBack}
        </Link>
      </div>

      <div className="rounded-3xl bg-white/70 dark:bg-gray-900/60 shadow-xl border border-white/40 dark:border-gray-700/40 backdrop-blur p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={imageSrc}
            alt={displayName}
            onError={handleImageError}
            className="w-40 h-40 object-contain mb-4"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{displayName}</h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            {displayLevel !== undefined && displayLevel !== null ? (
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
                {texts.detailLevelLabel}: {displayLevel}
              </span>
            ) : null}
            {displayType ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200">
                {texts.detailTypeLabel}: {displayType}
              </span>
            ) : null}
          </div>
          <p className="mt-4 text-base text-gray-700 dark:text-gray-300 max-w-2xl">{description}</p>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">
            {texts.detailFusionsTitle}
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
              {texts.detailFusionsEmpty}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
