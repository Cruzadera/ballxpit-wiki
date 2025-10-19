import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiFusion } from '../../types/wiki';

export default function FusionsPage() {
  const { t, i18n } = useTranslation();
  const { searchTerm } = useWikiLayout();
  const [fusions, setFusions] = useState<WikiFusion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiFusion[]>('/fusions')
      .then((data) => {
        if (mounted) {
          setFusions(data);
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

  const filteredFusions = useMemo(() => {
    if (!searchTerm) {
      return fusions;
    }

    return fusions.filter((fusion) => {
      const target = `${fusion.result.name ?? ''} ${fusion.description ?? ''} ${fusion.components
        .map((component) => component.name ?? '')
        .join(' ')}`.toLowerCase();
      return target.includes(searchTerm.toLowerCase());
    });
  }, [fusions, searchTerm]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection title={t('pages.fusions.title')} subtitle={t('pages.fusions.subtitle')}>
      {filteredFusions.length === 0 ? (
        <p className="text-sm text-slate-400">{t('noResults')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredFusions.map((fusion) => (
            <article
              key={fusion.slug}
              className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-6 shadow-inner shadow-indigo-500/5"
            >
              <header className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-slate-100">
                  <Link to={`/wiki/fusions/${fusion.slug}`} className="hover:text-indigo-200">
                    {fusion.result.name}
                  </Link>
                </h3>
                <p className="text-sm text-slate-400">{fusion.description ?? t('noDescription')}</p>
              </header>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                {fusion.components.map((component) => (
                  <Link
                    key={component.slug}
                    to={`/wiki/balls/${component.slug}`}
                    className="rounded-full border border-slate-600/40 px-3 py-1 hover:border-indigo-400/60 hover:text-indigo-200"
                  >
                    {component.name}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </WikiSection>
  );
}
