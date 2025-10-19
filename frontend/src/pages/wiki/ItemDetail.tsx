import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiItem } from '../../types/wiki';

export default function ItemDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { setDetailBreadcrumb } = useWikiLayout();
  const [item, setItem] = useState<WikiItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiItem>(`/items/${slug}`)
      .then((data) => {
        if (mounted) {
          setItem(data);
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
    if (item?.name) {
      setDetailBreadcrumb(item.name);
    } else {
      setDetailBreadcrumb(null);
    }

    return () => {
      setDetailBreadcrumb(null);
    };
  }, [item?.name, setDetailBreadcrumb]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError || !item) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <section className="grid gap-8 rounded-3xl border border-slate-700/40 bg-slate-900/50 p-8 md:grid-cols-[280px,1fr]">
      <div className="flex flex-col gap-4">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name ?? ''} className="rounded-2xl border border-slate-700/60" />
        ) : (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/70 text-4xl">
            🎒
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-100">{item.name}</h1>
        {item.type && <p className="text-sm uppercase tracking-wide text-indigo-200">{item.type}</p>}
        <WikiSection title={t('ballDetail.overview')}>
          <p className="text-base text-slate-300">{item.description ?? t('noDescription')}</p>
        </WikiSection>
      </div>
    </section>
  );
}
