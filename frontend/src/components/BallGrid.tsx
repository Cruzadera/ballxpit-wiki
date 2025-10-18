import { useEffect, useMemo, useState } from "react";
import BallCard, { BallLike } from "./BallCard";

type BallSummary = BallLike & {
  descripcion?: string | null;
  description?: string | null;
};

const TYPE_ALIASES: Record<string, string[]> = {
  "Físico": ["físico", "fisico", "physical", "physic"],
  "Elemento": ["elemento", "elemental", "element"],
  "Orgánico": ["orgánico", "organico", "organic"],
  "Oscuro": ["oscuro", "dark"],
};

export default function BallGrid() {
  const [balls, setBalls] = useState<BallSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

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

  const filteredBalls = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return balls.filter((ball) => {
      const displayName = (ball.nombre || ball.name || "").toLowerCase();
      const matchesQuery = normalizedQuery
        ? displayName.includes(normalizedQuery)
        : true;

      if (!matchesQuery) return false;

      if (!selectedType) return true;

      const displayType = (ball.type || ball.tipo || "").toLowerCase();
      const aliases = TYPE_ALIASES[selectedType] || [selectedType.toLowerCase()];

      return aliases.some((alias) => displayType.includes(alias));
    });
  }, [balls, query, selectedType]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Cargando bolas...</p>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 w-full sm:w-1/3 bg-white/80 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 w-full sm:w-1/4 bg-white/80 dark:bg-gray-900/60 text-gray-800 dark:text-gray-100"
        >
          <option value="">Todos los tipos</option>
          {Object.keys(TYPE_ALIASES).map((typeKey) => (
            <option key={typeKey} value={typeKey}>
              {typeKey}
            </option>
          ))}
        </select>
      </div>

      {filteredBalls.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No se encontraron bolas que coincidan con la búsqueda.
        </p>
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
