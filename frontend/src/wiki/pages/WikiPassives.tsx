import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WikiGallery from '../components/WikiGallery';
import type { WikiPassive } from '../../types/wiki';
import { fetchWiki } from '../../utils/wikiApi';

export default function WikiPassives() {
  const { t, i18n } = useTranslation();
  const [passives, setPassives] = useState<WikiPassive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchWiki<WikiPassive[]>('/passives')
      .then((data) => {
        if (mounted) {
          setPassives(data);
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

  const cards = passives.map((passive) => ({
    title: passive.name ?? t('noTitle'),
    description: passive.description ?? t('noDescription'),
    imageUrl: passive.imageUrl ?? undefined
  }));

  return (
    <section className="wiki-section">
      <h2>{t('wiki.passives.title')}</h2>
      <p>{t('wiki.passives.subtitle')}</p>

      {loading ? <div className="wiki-loading">{t('loading')}</div> : null}
      {error ? <div className="wiki-error">{t('error')}</div> : null}
      {!loading && !error && cards.length === 0 ? (
        <div className="wiki-empty-state">{t('wiki.passives.empty')}</div>
      ) : null}

      {!loading && !error ? <WikiGallery items={cards} /> : null}
    </section>
  );
}
