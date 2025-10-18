import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

type FusionRecipe = {
  id: number;
  result: { id: number; name: string };
  inputs: { id: number; name: string }[];
};

type BallDetail = {
  id: number;
  name: string;
  nombre?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  type: string;
  level?: number | null;
  fusionInputs?: FusionRecipe[];
};

export default function BallDetail() {
  const { id } = useParams();
  const [ball, setBall] = useState<BallDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    fetch(`${apiUrl}/balls/${id}`)
      .then((res) => res.json())
      .then((data: BallDetail) => {
        setBall(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading ball:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!ball) return <p className="text-center mt-10">Bola no encontrada</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-indigo-600 hover:underline">← Volver</Link>
      <div className="flex flex-col items-center mt-4">
        {ball.imageUrl ? (
          <img src={ball.imageUrl} alt={ball.name} className="w-32 h-32 object-contain mb-4" />
        ) : null}
        <h2 className="text-2xl font-bold mb-1">{ball.nombre ?? ball.name}</h2>
        {ball.level !== undefined && ball.level !== null ? (
          <p className="text-gray-500 mb-2">Nivel {ball.level}</p>
        ) : null}
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{ball.type}</span>
        {ball.description ? (
          <p className="mt-4 text-center text-gray-700">{ball.description}</p>
        ) : null}
      </div>

      {ball.fusionInputs?.length ? (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-center">🔗 Fusiones que la usan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ball.fusionInputs.map((fusion) => (
              <div key={fusion.id} className="p-3 rounded-xl bg-white shadow text-center">
                {fusion.inputs.map((i) => i.name).join(" + ")} → <strong>{fusion.result.name}</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
