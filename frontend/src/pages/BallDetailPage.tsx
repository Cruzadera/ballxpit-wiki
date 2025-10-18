import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BallDetail, FusionRecipe } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function BallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ball, setBall] = useState<BallDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    async function fetchBall() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/balls/${id}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('No pudimos cargar los datos de la bola');
        }
        const data: BallDetail = await response.json();
        setBall(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBall();
    return () => controller.abort();
  }, [id]);

  const fusionRecipes = useMemo(() => {
    if (!ball) return [] as FusionRecipe[];
    const recipesMap = new Map<number, FusionRecipe>();
    ball.fusionInputs.forEach(({ recipe }) => {
      recipesMap.set(recipe.id, recipe);
    });
    return Array.from(recipesMap.values());
  }, [ball]);

  const resultingFusions = ball?.fusionResults ?? [];

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Cargando ficha...
      </div>
    );
  }

  if (error || !ball) {
    return (
      <div className="space-y-4">
        <Link to="/" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300">
          ← Volver al listado
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
          {error ?? 'Esta bola no existe o fue eliminada.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300">
        ← Volver al listado
      </Link>

      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[240px,1fr]">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 p-6 dark:from-slate-900 dark:to-slate-950">
          <img src={ball.imageUrl} alt={ball.name} className="h-40 w-40 object-contain" />
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
            {ball.type}
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{ball.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Nivel recomendado: {ball.level}</p>
          </div>
          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{ball.description}</p>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Evoluciones</h2>
        {ball.evolutionsFrom.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No se registran evoluciones para esta bola.</p>
        ) : (
          <ul className="space-y-3">
            {ball.evolutionsFrom.map((evolution) => (
              <li key={evolution.id} className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                Evoluciona en
                <Link
                  to={`/ball/${evolution.evolvedBall.id}`}
                  className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
                >
                  {evolution.evolvedBall.name}
                </Link>
                (nivel {evolution.requiredLevel})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Fusiones</h2>
        {fusionRecipes.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Esta bola no participa en fusiones registradas.</p>
        ) : (
          <ul className="space-y-4">
            {fusionRecipes.map((recipe) => {
              const others = recipe.inputs.filter((input) => input.ball.id !== ball.id);
              return (
                <li key={recipe.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Se fusiona con</span>
                    {others.length === 0 ? (
                      <span>otro ejemplar de {ball.name}</span>
                    ) : (
                      others.map((input, index) => (
                        <span key={input.id} className="inline-flex items-center gap-1">
                          <Link
                            to={`/ball/${input.ball.id}`}
                            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
                          >
                            {input.ball.name}
                          </Link>
                          {index < others.length - 1 && <span>+</span>}
                        </span>
                      ))
                    )}
                    <span>→</span>
                    <Link
                      to={`/ball/${recipe.result.id}`}
                      className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
                    >
                      {recipe.result.name}
                    </Link>
                    <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Nivel {recipe.requiredLevel}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Resultado de fusiones</h2>
        {resultingFusions.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Ninguna receta conocida produce esta bola.</p>
        ) : (
          <ul className="space-y-4">
            {resultingFusions.map((recipe) => (
              <li
                key={recipe.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {recipe.inputs.map((input, index) => (
                    <span key={input.id} className="inline-flex items-center gap-1">
                      <Link
                        to={`/ball/${input.ball.id}`}
                        className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
                      >
                        {input.ball.name}
                      </Link>
                      {index < recipe.inputs.length - 1 && <span>+</span>}
                    </span>
                  ))}
                  <span>→</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{ball.name}</span>
                  <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Nivel {recipe.requiredLevel}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BallDetailPage;
