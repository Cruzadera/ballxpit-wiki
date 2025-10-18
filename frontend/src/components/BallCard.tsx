import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslations } from "../i18n/translations";
import { DEFAULT_ICON, getBallIcon } from "../utils/getBallIcon";

export type BallLike = {
  id: number;
  name?: string | null;
  nombre?: string | null;
  type?: string | null;
  tipo?: string | null;
  level?: number | null;
  nivel?: number | null;
  imageUrl?: string | null;
  imagen?: string | null;
  descripcion?: string | null;
  description?: string | null;
};

interface BallCardProps {
  ball: BallLike;
}

export default function BallCard({ ball }: BallCardProps) {
  const texts = useTranslations();
  const displayName = useMemo(
    () => ball.nombre || ball.name || "Bola misteriosa",
    [ball.nombre, ball.name]
  );

  const description =
    ball.descripcion || ball.description || texts.cardFallbackDescription;

  const [imageSrc, setImageSrc] = useState<string>(() => getBallIcon(ball));

  useEffect(() => {
    setImageSrc(getBallIcon(ball));
  }, [ball.nombre, ball.name, ball.tipo, ball.type, ball.imageUrl, ball.imagen]);

  const handleImageError = () => {
    if (imageSrc !== DEFAULT_ICON) {
      setImageSrc(DEFAULT_ICON);
    }
  };

  return (
    <Link
      to={`/ball/${ball.id}`}
      className="block rounded-2xl shadow-md bg-white/70 dark:bg-gray-800/70 p-4 hover:shadow-xl transition border border-white/50 dark:border-gray-700/40 backdrop-blur"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={imageSrc}
          alt={displayName}
          onError={handleImageError}
          className="w-20 h-20 object-contain mb-3"
        />
        <h3 className="font-semibold text-center text-gray-800 dark:text-gray-100 text-lg">
          {displayName}
        </h3>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1 min-h-[3rem]">
          {description}
        </p>
        <span className="mt-4 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
          {texts.cardCallToAction}
        </span>
      </div>
    </Link>
  );
}
