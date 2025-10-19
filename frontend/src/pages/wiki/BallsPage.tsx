import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WikiCard from '../../components/wiki/WikiCard';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiBall } from '../../types/wiki';

export default function BallsPage() {
  const { t, i18n } = useTranslation();
  const { searchTerm } = useWikiLayout();
  const [balls, setBalls] = useState<WikiBall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiBall[]>('/balls')
      .then((data) => {
        if (mounted) {
          setBalls(data);
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

  const filteredBalls = useMemo(() => {
    if (!searchTerm) {
      return balls;
    }

    return balls.filter((ball) => {
      const target = `${ball.name ?? ''} ${ball.description ?? ''}`.toLowerCase();
      return target.includes(searchTerm.toLowerCase());
    });
  }, [balls, searchTerm]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection title={t('pages.balls.title')} subtitle={t('pages.balls.subtitle')}>
      {filteredBalls.length === 0 ? (
        <p className="text-sm text-slate-400">{t('noResults')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBalls.map((ball) => (
            <WikiCard
              key={ball.slug}
              to={`/wiki/balls/${ball.slug}`}
              title={ball.name}
              description={ball.description}
              imageUrl={ball.imageUrl ?? undefined}
              tags={ball.tags}
            />
          ))}
        </div>
      )}
    </WikiSection>
  );
}
