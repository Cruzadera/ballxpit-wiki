import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getIcon } from "../utils/getBallIcon";
import { translateBallName } from "../utils/translateBall";

export type BallLike = {
  id: number;
  name?: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  description?: string | null;
  fusionResults?: { id: number }[] | null;
};

interface BallCardProps {
  ball: BallLike;
}

export default function BallCard({ ball }: BallCardProps) {
  const { t, i18n } = useTranslation();
  const rawName = ball.nombre || ball.name || t("unknownBallName");
  const displayName = useMemo(
    () => translateBallName(rawName),
    [rawName, i18n.language]
  );

  const rawDescription =
    ball.descripcion || ball.description || t("cardFallbackDescription");
  const description = useMemo(
    () => translateBallName(rawDescription),
    [rawDescription, i18n.language]
  );

  const iconSrc = getIcon(ball.nombre || ball.name || "");

  return (
    <Link
      to={`/ball/${ball.id}`}
      className="block rounded-2xl shadow p-4 bg-white/90 dark:bg-gray-800/80 hover:scale-105 transition-transform duration-200 border border-gray-200/60 dark:border-gray-700/60"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={iconSrc}
          alt={displayName}
          className="w-20 h-20 object-contain mx-auto mb-3"
        />
        <h3 className="font-semibold text-center text-gray-800 dark:text-gray-100 text-lg">
          {displayName}
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1 min-h-[3rem]">
          {description}
        </p>
        <span className="mt-4 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          {t("cardCallToAction")}
        </span>
      </div>
    </Link>
  );
}
