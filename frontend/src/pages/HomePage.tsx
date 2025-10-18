import { useEffect, useMemo, useState } from 'react';
import BallCard from '../components/BallCard';
import { Ball } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function HomePage() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBalls() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/balls`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de bolas');
        }
        const data: Ball[] = await response.json();
        setBalls(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBalls();
    return () => controller.abort();
  }, []);

  const types = useMemo(() => Array.from(new Set(balls.map((ball) => ball.type))).sort(), [balls]);

  const filteredBalls = useMemo(() => {
    return balls.filter((ball) => {
      const matchesSearch = ball.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter ? ball.type === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [balls, search, typeFilter]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Explora las bolas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Busca por nombre o filtra por tipo elemental para descubrir fusiones y evoluciones.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-60"
          >
            <option value="">Todos los tipos</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Cargando bolas...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      ) : filteredBalls.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-6 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No encontramos bolas que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBalls.map((ball) => (
            <BallCard key={ball.id} ball={ball} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
