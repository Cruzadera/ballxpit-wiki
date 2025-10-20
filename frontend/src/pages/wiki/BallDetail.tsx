import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiBallDetail, WikiEvolution } from '../../types/wiki';

export default function BallDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { setDetailBreadcrumb } = useWikiLayout();
  const [ball, setBall] = useState<WikiBallDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [possibleEvolutions, setPossibleEvolutions] = useState<WikiEvolution[]>([]);
  const [isLoadingPossibleEvolutions, setIsLoadingPossibleEvolutions] = useState(false);

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

  useEffect(() => {
    if (!ball || ball.type !== 'pure') {
      setPossibleEvolutions([]);
      setIsLoadingPossibleEvolutions(false);
      return;
    }

    let mounted = true;
    setIsLoadingPossibleEvolutions(true);

    fetchWiki<WikiEvolution[]>('/evolutions')
      .then((data) => {
        if (!mounted) {
          return;
        }

        const filtered = data
          .filter((evolution) => {
            const matchesSlug = evolution.base.slug === ball.slug;
            const matchesName = ball.name && evolution.base.name?.toLowerCase() === ball.name.toLowerCase();
            return matchesSlug || matchesName;
          })
          .map((evolution) => ({
            ...evolution,
            imageUrl: evolution.imageUrl ?? evolution.result.imageUrl ?? null
          }));

        setPossibleEvolutions(filtered);
      })
      .catch(() => {
        if (mounted) {
          setPossibleEvolutions([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingPossibleEvolutions(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [ball?.slug, ball?.name, ball?.type, i18n.language]);

  const buildEvolutionImageSrc = (imageUrl?: string | null) => {
    if (!imageUrl) {
      return null;
    }

    if (/^https?:\/\//i.test(imageUrl)) {
      return imageUrl;
    }

    const normalized = imageUrl.replace(/^\/+/, '');
    if (normalized.startsWith('wiki/images/')) {
      return `/${normalized}`;
    }

    if (imageUrl.startsWith('/wiki/images/')) {
      return imageUrl;
    }

    return `/wiki/images/${normalized}`;
  };

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

      {ball.type === 'pure' && (
        <WikiSection title={t('ballDetail.possibleEvolutions')}>
          {isLoadingPossibleEvolutions ? (
            <p className="text-sm text-slate-400">{t('loading')}</p>
          ) : possibleEvolutions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {possibleEvolutions.map((evolution) => {
                const imageSrc = buildEvolutionImageSrc(evolution.imageUrl ?? evolution.result.imageUrl);

                return (
                  <article
                    key={evolution.slug}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-900/40 p-6 shadow-inner shadow-indigo-500/5"
                  >
                    {imageSrc && (
                      <img
                        src={imageSrc}
                        alt={evolution.result.name ?? ''}
                        className="h-32 w-full rounded-xl border border-slate-700/60 object-contain bg-slate-800/70"
                      />
                    )}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-slate-100">{evolution.result.name}</h3>
                      <p className="text-sm text-slate-400">{evolution.description ?? t('noDescription')}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">{t('ballDetail.noKnownEvolutions')}</p>
          )}
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
