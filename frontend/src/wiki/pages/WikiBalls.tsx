import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WikiGallery from '../components/WikiGallery';
import type { WikiBall } from '../../types/wiki';
import { fetchWiki } from '../../utils/wikiApi';

export default function WikiBalls() {
  const { t, i18n } = useTranslation();
  const [balls, setBalls] = useState<WikiBall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchWiki<WikiBall[]>('/balls')
      .then((data) => {
        if (mounted) {
          setBalls(data);
        }
      })
      .catch((err: Error) => {
        if (mounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [i18n.language]);

  const cards = balls.map((ball) => ({
    title: ball.name ?? t('noTitle'),
    description: ball.description ?? t('noDescription'),
    imageUrl: ball.imageUrl ?? undefined
  }));

  return (
    <section className="wiki-section">
      <h2>{t('pages.balls.title')}</h2>
      <p>{t('pages.balls.subtitle')}</p>

      {loading ? <div className="wiki-loading">{t('loading')}</div> : null}
      {error ? <div className="wiki-error">{t('error')}</div> : null}
      {!loading && !error && cards.length === 0 ? (
        <div className="wiki-empty-state">{t('noResults')}</div>
      ) : null}

      {!loading && !error ? <WikiGallery items={cards} /> : null}
    </section>
  );
}
