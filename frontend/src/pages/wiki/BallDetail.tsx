import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiBallDetail } from '../../types/wiki';

export default function BallDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { setDetailBreadcrumb } = useWikiLayout();
  const [ball, setBall] = useState<WikiBallDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiBallDetail>(`/balls/${slug}`)
      .then((data) => {
        if (mounted) {
          setBall(data);
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
    if (ball?.name) {
      setDetailBreadcrumb(ball.name);
    } else {
      setDetailBreadcrumb(null);
    }

    return () => {
      setDetailBreadcrumb(null);
    };
  }, [ball?.name, setDetailBreadcrumb]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError || !ball) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <div className="flex flex-col gap-12">
      <section className="grid gap-8 rounded-3xl border border-slate-700/40 bg-slate-900/50 p-8 md:grid-cols-[280px,1fr]">
        <div className="flex flex-col gap-4">
          {ball.imageUrl ? (
            <img src={ball.imageUrl} alt={ball.name ?? ''} className="rounded-2xl border border-slate-700/60" />
          ) : (
            <div className="flex h-60 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/70 text-4xl">
              🜂
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {ball.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-300"
              >
                {t(`tags.${tag}`)}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-slate-100">{ball.name}</h1>
          <p className="text-base text-slate-300">{ball.description ?? t('noDescription')}</p>
        </div>
      </section>

      {ball.fusionRecipes.length > 0 && (
        <WikiSection title={t('ballDetail.fusionRecipes')}>
          <div className="grid gap-6 md:grid-cols-2">
            {ball.fusionRecipes.map((fusion) => (
              <div
                key={fusion.slug}
                className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-6 shadow-inner shadow-indigo-500/5"
              >
                <h3 className="text-lg font-semibold text-slate-100">{fusion.result.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{fusion.description ?? t('noDescription')}</p>
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
              </div>
            ))}
          </div>
        </WikiSection>
      )}

      {ball.fusionAppearances.length > 0 && (
        <WikiSection title={t('ballDetail.fusionAppearances')}>
          <div className="flex flex-wrap gap-3">
            {ball.fusionAppearances.map((fusion) => (
              <Link
                key={fusion.slug}
                to={`/wiki/fusions/${fusion.slug}`}
                className="rounded-full border border-slate-600/40 px-4 py-2 text-sm hover:border-indigo-400/60 hover:text-indigo-200"
              >
                {fusion.result.name}
              </Link>
            ))}
          </div>
        </WikiSection>
      )}

      {ball.evolutionsFrom.length > 0 && (
        <WikiSection title={t('ballDetail.evolutionsFrom')}>
          <div className="grid gap-4 md:grid-cols-2">
            {ball.evolutionsFrom.map((evolution) => (
              <Link
                key={evolution.slug}
                to={`/wiki/evolutions/${evolution.slug}`}
                className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-5 transition hover:border-indigo-400/60 hover:text-indigo-200"
              >
                <h3 className="text-lg font-semibold">{evolution.result?.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{evolution.description ?? t('noDescription')}</p>
              </Link>
            ))}
          </div>
        </WikiSection>
      )}

      {ball.evolutionsInto.length > 0 && (
        <WikiSection title={t('ballDetail.evolutionsInto')}>
          <div className="grid gap-4 md:grid-cols-2">
            {ball.evolutionsInto.map((evolution) => (
              <Link
                key={evolution.slug}
                to={`/wiki/evolutions/${evolution.slug}`}
                className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-5 transition hover:border-indigo-400/60 hover:text-indigo-200"
              >
                <h3 className="text-lg font-semibold">{evolution.base?.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{evolution.description ?? t('noDescription')}</p>
              </Link>
            ))}
          </div>
        </WikiSection>
      )}
    </div>
  );
}
