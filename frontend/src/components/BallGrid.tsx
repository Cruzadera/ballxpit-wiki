import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type BallSummary = {
  id: number;
  name: string;
  nombre?: string | null;
  type: string;
  level?: number | null;
  imageUrl?: string | null;
};

export default function BallGrid() {
  const [balls, setBalls] = useState<BallSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    fetch(`${apiUrl}/balls`)
      .then((res) => res.json())
      .then((data: BallSummary[]) => {
        setBalls(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching balls:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando bolas...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {balls.map((ball) => (
        <Link
          to={`/ball/${ball.id}`}
          key={ball.id}
          className="rounded-2xl shadow p-4 bg-white hover:shadow-lg transition"
        >
          {ball.imageUrl ? (
            <img
              src={ball.imageUrl}
              alt={ball.name}
              className="w-24 h-24 object-contain mx-auto mb-2"
            />
          ) : null}
          <h3 className="text-lg font-bold text-center">{ball.nombre ?? ball.name}</h3>
          {ball.level !== undefined && ball.level !== null ? (
            <p className="text-center text-sm">Nivel {ball.level}</p>
          ) : null}
          <span className="block mt-1 text-center text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            {ball.type}
          </span>
        </Link>
      ))}
    </div>
  );
}
