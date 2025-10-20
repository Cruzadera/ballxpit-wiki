import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WikiGallery from '../components/WikiGallery';
import type { WikiCharacter } from '../../types/wiki';
import { fetchWiki } from '../../utils/wikiApi';

export default function WikiCharacters() {
  const { t, i18n } = useTranslation();
  const [characters, setCharacters] = useState<WikiCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchWiki<WikiCharacter[]>('/characters')
      .then((data) => {
        if (mounted) {
          setCharacters(data);
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

  const cards = characters.map((character) => {
    const startingBall = character.startingBall ?? t('wiki.characters.unknown');
    const unlock = character.unlockRequirement ?? t('wiki.characters.unknown');

    return {
      title: character.name ?? t('noTitle'),
      description: character.description ?? t('noDescription'),
      imageUrl: character.imageUrl ?? undefined,
      children: (
        <div className="wiki-card-details">
          <span>
            <strong>{t('wiki.characters.startingBall')}:</strong> {startingBall}
          </span>
          <span>
            <strong>{t('wiki.characters.unlockRequirement')}:</strong> {unlock}
          </span>
        </div>
      )
    };
  });

  return (
    <section className="wiki-section">
      <h2>{t('pages.characters.title')}</h2>
      <p>{t('pages.characters.subtitle')}</p>

      {loading ? <div className="wiki-loading">{t('loading')}</div> : null}
      {error ? <div className="wiki-error">{t('error')}</div> : null}
      {!loading && !error && cards.length === 0 ? (
        <div className="wiki-empty-state">{t('noResults')}</div>
      ) : null}

      {!loading && !error ? <WikiGallery items={cards} /> : null}
    </section>
  );
}
