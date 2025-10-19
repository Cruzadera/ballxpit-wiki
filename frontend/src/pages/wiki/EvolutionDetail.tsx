import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiEvolution } from '../../types/wiki';

export default function EvolutionDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [evolution, setEvolution] = useState<WikiEvolution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiEvolution>(`/evolutions/${slug}`)
      .then((data) => {
        if (mounted) {
          setEvolution(data);
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
  }, [slug, i18n.language]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError || !evolution) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection
      title={`${evolution.base.name ?? t('noTitle')} → ${evolution.result.name ?? t('noTitle')}`}
      subtitle={evolution.description ?? t('noDescription')}
    >
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
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
    </WikiSection>
  );
}
