import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WikiCard from '../../components/wiki/WikiCard';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiCharacter } from '../../types/wiki';

export default function CharactersPage() {
  const { t, i18n } = useTranslation();
  const { searchTerm } = useWikiLayout();
  const [characters, setCharacters] = useState<WikiCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiCharacter[]>('/characters')
      .then((data) => {
        if (mounted) {
          setCharacters(data);
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

  const filteredCharacters = useMemo(() => {
    if (!searchTerm) {
      return characters;
    }

    return characters.filter((character) => {
      const target = `${character.name ?? ''} ${character.description ?? ''} ${character.title ?? ''}`.toLowerCase();
      return target.includes(searchTerm.toLowerCase());
    });
  }, [characters, searchTerm]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection title={t('pages.characters.title')} subtitle={t('pages.characters.subtitle')}>
      {filteredCharacters.length === 0 ? (
        <p className="text-sm text-slate-400">{t('noResults')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCharacters.map((character) => (
            <WikiCard
              key={character.slug}
              to={`/wiki/characters/${character.slug}`}
              title={character.name}
              description={character.description ?? character.title}
              imageUrl={character.imageUrl ?? undefined}
            />
          ))}
        </div>
      )}
    </WikiSection>
  );
}
