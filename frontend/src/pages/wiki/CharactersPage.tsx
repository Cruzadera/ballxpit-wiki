import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
      const target = `${character.name ?? ''} ${character.description ?? ''} ${character.startingBall ?? ''} ${
        character.unlockRequirement ?? ''
      }`.toLowerCase();
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
            <Link
              key={character.slug}
              to={`/wiki/characters/${character.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/40 bg-slate-900/50 transition-transform duration-200 hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              {character.imageUrl ? (
                <div className="h-40 w-full overflow-hidden bg-slate-800">
                  <img
                    src={character.imageUrl}
                    alt={character.name ?? ''}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-slate-800/70 text-4xl" aria-hidden>
                  🛡️
                </div>
              )}

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-slate-100">{character.name ?? t('noTitle')}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3">
                    {character.description ?? t('noDescription')}
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-2 rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {t('character.startingBall')}
                    </span>
                    <span className="font-medium text-indigo-200">
                      {character.startingBall ?? t('character.unknown')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {t('character.unlockRequirement')}
                    </span>
                    <span className="font-medium text-slate-200">
                      {character.unlockRequirement ?? t('character.none')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </WikiSection>
  );
}
