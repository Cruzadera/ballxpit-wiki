import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiEvolution } from '../../types/wiki';

export default function EvolutionsPage() {
  const { t, i18n } = useTranslation();
  const { searchTerm } = useWikiLayout();
  const [evolutions, setEvolutions] = useState<WikiEvolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiEvolution[]>('/evolutions')
      .then((data) => {
        if (mounted) {
          setEvolutions(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [i18n.language]);

  const filteredEvolutions = useMemo(() => {
    if (!searchTerm) {
      return evolutions;
    }

    return evolutions.filter((evolution) => {
      const target = `${evolution.base.name ?? ''} ${evolution.result.name ?? ''} ${evolution.description ?? ''}`.toLowerCase();
      return target.includes(searchTerm.toLowerCase());
    });
  }, [evolutions, searchTerm]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection title={t('pages.evolutions.title')} subtitle={t('pages.evolutions.subtitle')}>
      {filteredEvolutions.length === 0 ? (
        <p className="text-sm text-slate-400">{t('noResults')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvolutions.map((evolution) => (
            <article
              key={evolution.slug}
              className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-6 shadow-inner shadow-indigo-500/5"
            >
              {evolution.imageUrl ? (
                <img
                  src={evolution.imageUrl}
                  alt={`${evolution.base.name} → ${evolution.result.name}`}
                  className="mb-3 h-32 w-full rounded-xl object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="mb-3 flex h-32 w-full items-center justify-center rounded-xl bg-neutral-800 text-sm text-gray-400">
                  Sin imagen
                </div>
              )}
              <header className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-slate-100">
                  <Link to={`/wiki/evolutions/${evolution.slug}`} className="hover:text-indigo-200">
                    {evolution.base.name} → {evolution.result.name}
                  </Link>
                </h3>
                <p className="text-sm text-slate-400">{evolution.description ?? t('noDescription')}</p>
              </header>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                <Link
                  to={`/wiki/balls/${evolution.base.slug}`}
                  className="rounded-full border border-slate-600/40 px-3 py-1 hover:border-indigo-400/60 hover:text-indigo-200"
                >
                  {evolution.base.name}
                </Link>
                <span aria-hidden className="text-slate-500">
                  →
                </span>
                <Link
                  to={`/wiki/balls/${evolution.result.slug}`}
                  className="rounded-full border border-slate-600/40 px-3 py-1 hover:border-indigo-400/60 hover:text-indigo-200"
                >
                  {evolution.result.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </WikiSection>
  );
}
