import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WikiGallery from '../components/WikiGallery';
import type { WikiEvolution } from '../../types/wiki';
import { fetchWiki } from '../../utils/wikiApi';

export default function WikiEvolutions() {
  const { t, i18n } = useTranslation();
  const [evolutions, setEvolutions] = useState<WikiEvolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchWiki<WikiEvolution[]>('/evolutions')
      .then((data) => {
        if (mounted) {
          setEvolutions(data);
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

  const cards = evolutions.map((evolution) => {
    const baseName = evolution.base?.name ?? t('wiki.evolutions.unknownBase');
    const resultName = evolution.result?.name ?? t('wiki.evolutions.unknownResult');

    return {
      title: resultName,
      description: evolution.description ?? t('noDescription'),
      imageUrl: evolution.result?.imageUrl ?? undefined,
      children: (
        <div className="wiki-card-details">
          <span>
            <strong>{t('wiki.evolutions.baseLabel')}:</strong> {baseName}
          </span>
          <span>
            <strong>{t('wiki.evolutions.resultLabel')}:</strong> {resultName}
          </span>
        </div>
      )
    };
  });

  return (
    <section className="wiki-section">
      <h2>{t('pages.evolutions.title')}</h2>
      <p>{t('pages.evolutions.subtitle')}</p>

      {loading ? <div className="wiki-loading">{t('loading')}</div> : null}
      {error ? <div className="wiki-error">{t('error')}</div> : null}
      {!loading && !error && cards.length === 0 ? (
        <div className="wiki-empty-state">{t('noResults')}</div>
      ) : null}

      {!loading && !error ? <WikiGallery items={cards} /> : null}
    </section>
  );
}
