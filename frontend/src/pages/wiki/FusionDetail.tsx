import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiFusion } from '../../types/wiki';

export default function FusionDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [fusion, setFusion] = useState<WikiFusion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiFusion>(`/fusions/${slug}`)
      .then((data) => {
        if (mounted) {
          setFusion(data);
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

  if (hasError || !fusion) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection title={fusion.result.name ?? t('noTitle')} subtitle={fusion.description ?? t('noDescription')}>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
        {fusion.components.map((component) => (
          <Link
            key={component.slug}
            to={`/wiki/balls/${component.slug}`}
            className="rounded-full border border-slate-600/40 px-3 py-1 hover:border-indigo-400/60 hover:text-indigo-200"
          >
            {component.name}
          </Link>
        ))}
        <span aria-hidden className="text-slate-500">
          →
        </span>
        <Link
          to={`/wiki/balls/${fusion.result.slug}`}
          className="rounded-full border border-slate-600/40 px-3 py-1 hover:border-indigo-400/60 hover:text-indigo-200"
        >
          {fusion.result.name}
        </Link>
      </div>
    </WikiSection>
  );
}
