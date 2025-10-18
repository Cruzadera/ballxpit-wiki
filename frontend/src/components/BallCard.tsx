import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
};

interface BallCardProps {
  ball: BallLike;
}

export default function BallCard({ ball }: BallCardProps) {
  const displayName = useMemo(
    () => ball.nombre || ball.name || "Bola misteriosa",
    [ball.nombre, ball.name]
  );

  const displayLevel = ball.level ?? ball.nivel;
  const displayType = ball.type || ball.tipo || "Especial";

  const normalizedName = useMemo(
    () =>
      (ball.nombre || ball.name)
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "",
    [ball.nombre, ball.name]
  );

  const localImage = normalizedName ? `/images/${normalizedName}.png` : undefined;
  const placeholder = useMemo(
    () =>
      `https://via.placeholder.com/128?text=${encodeURIComponent(
        displayName || "Bola"
      )}`,
    [displayName]
  );

  const computeInitialSrc = () =>
    ball.imageUrl || ball.imagen || localImage || placeholder;

  const [imageSrc, setImageSrc] = useState<string>(() => computeInitialSrc());

  useEffect(() => {
    setImageSrc(computeInitialSrc());
  }, [ball.imageUrl, ball.imagen, localImage, placeholder]);

  return (
    <Link
      to={`/ball/${ball.id}`}
      className="rounded-2xl shadow p-4 bg-white/60 dark:bg-gray-800/70 hover:shadow-lg transition border border-white/40 dark:border-gray-700/40 backdrop-blur"
    >
      <img
        src={imageSrc}
        alt={displayName}
        onError={() => setImageSrc(placeholder)}
        className="w-24 h-24 object-contain mx-auto mb-3 drop-shadow"
      />
      <h3 className="text-lg font-bold text-center text-gray-900 dark:text-gray-100">
        {displayName}
      </h3>
      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Nivel {displayLevel ?? "—"}
      </p>
      <span className="block mt-2 text-center text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200 px-3 py-1 rounded-full">
        {displayType}
      </span>
    </Link>
  );
}
