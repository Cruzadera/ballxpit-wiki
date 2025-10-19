import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiPassiveEvolution } from '../../types/wiki';

export default function PassiveEvolutionDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { setDetailBreadcrumb } = useWikiLayout();
  const [evolution, setEvolution] = useState<WikiPassiveEvolution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiPassiveEvolution>(`/passive-evolutions/${slug}`)
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

  useEffect(() => {
    if (evolution?.result) {
      setDetailBreadcrumb(evolution.result);
    } else {
      setDetailBreadcrumb(null);
    }

    return () => {
      setDetailBreadcrumb(null);
    };
  }, [evolution?.result, setDetailBreadcrumb]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError || !evolution) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection
      title={evolution.result ?? t('noTitle')}
      subtitle={t('pages.passives.detail.subtitle')}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
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
          <span className="rounded-full border border-indigo-400/70 bg-indigo-500/10 px-3 py-1 text-indigo-200">
            {evolution.result ?? t('noTitle')}
          </span>
        </div>
        <p className="text-sm text-slate-400">{t('pages.passives.detail.componentsLabel', { value: evolution.componentsLabel })}</p>
      </div>
    </WikiSection>
  );
}
