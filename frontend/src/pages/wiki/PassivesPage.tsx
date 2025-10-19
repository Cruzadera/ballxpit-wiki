import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiPassive, WikiPassiveEvolution } from '../../types/wiki';

export default function PassivesPage() {
  const { t, i18n } = useTranslation();
  const { searchTerm } = useWikiLayout();
  const [passives, setPassives] = useState<WikiPassive[]>([]);
  const [evolutions, setEvolutions] = useState<WikiPassiveEvolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    Promise.all([
      fetchWiki<WikiPassive[]>('/passives'),
      fetchWiki<WikiPassiveEvolution[]>('/passive-evolutions')
    ])
      .then(([passiveData, evolutionData]) => {
        if (mounted) {
          setPassives(passiveData);
          setEvolutions(evolutionData);
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

  const filteredPassives = useMemo(() => {
    if (!searchTerm) {
      return passives;
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return passives.filter((passive) => {
      const target = `${passive.name ?? ''} ${passive.description ?? ''}`.toLowerCase();
      return target.includes(normalizedSearch);
    });
  }, [passives, searchTerm]);

  const filteredEvolutions = useMemo(() => {
    if (!searchTerm) {
      return evolutions;
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return evolutions.filter((evolution) => {
      const target = `${evolution.componentsLabel} ${evolution.result ?? ''}`.toLowerCase();
      return target.includes(normalizedSearch);
    });
  }, [evolutions, searchTerm]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <div className="flex flex-col gap-12">
      <WikiSection title={t('pages.passives.title')} subtitle={t('pages.passives.subtitle')}>
        {filteredPassives.length === 0 ? (
          <p className="text-sm text-slate-400">{t('noResults')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPassives.map((passive) => {
              const description = passive.description ?? t('noDescription');
              return (
                <article
                  key={passive.id}
                  title={description}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-900/40 p-5 shadow-inner shadow-indigo-500/5 transition hover:border-indigo-400/60 hover:shadow-indigo-500/10"
                >
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-700/30 bg-slate-800/40">
                    {passive.imageUrl ? (
                      <img
                        src={passive.imageUrl}
                        alt={passive.name ?? ''}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span aria-hidden className="text-4xl">🧿</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {passive.name ?? t('noTitle')}
                    </h3>
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </WikiSection>

      <WikiSection
        title={t('pages.passives.evolutionsTitle')}
        subtitle={t('pages.passives.evolutionsSubtitle')}
      >
        {filteredEvolutions.length === 0 ? (
          <p className="text-sm text-slate-400">{t('noResults')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredEvolutions.map((evolution) => (
              <article
                key={evolution.id}
                className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-5 shadow-inner shadow-indigo-500/5"
              >
                <header className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-300">
                  <span aria-hidden>🧩</span>
                  <span>{t('pages.passives.combinedEffects')}</span>
                </header>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                  {evolution.components.map((component, index) => (
                    <span
                      key={`${component}-${index}`}
                      className="rounded-full border border-slate-600/40 px-3 py-1 text-slate-300"
                    >
                      {component}
                    </span>
                  ))}
                  <span aria-hidden className="text-slate-500">
                    →
                  </span>
                  <Link
                    to={`/wiki/passives/${evolution.slug}`}
                    className="rounded-full border border-indigo-400/70 bg-indigo-500/10 px-3 py-1 text-indigo-200 transition hover:border-indigo-300/80 hover:text-indigo-100"
                  >
                    {evolution.result ?? t('noTitle')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </WikiSection>
    </div>
  );
}
