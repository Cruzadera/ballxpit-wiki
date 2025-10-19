import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WikiSection from '../../components/wiki/WikiSection';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiCharacter } from '../../types/wiki';

export default function CharacterDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [character, setCharacter] = useState<WikiCharacter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiCharacter>(`/characters/${slug}`)
      .then((data) => {
        if (mounted) {
          setCharacter(data);
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

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError || !character) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <section className="grid gap-8 rounded-3xl border border-slate-700/40 bg-slate-900/50 p-8 md:grid-cols-[280px,1fr]">
      <div className="flex flex-col gap-4">
        {character.imageUrl ? (
          <img src={character.imageUrl} alt={character.name ?? ''} className="rounded-2xl border border-slate-700/60" />
        ) : (
          <div className="flex h-60 items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-800/70 text-4xl">
            ⚔️
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-100">{character.name}</h1>
        {character.title && <p className="text-sm uppercase tracking-wide text-indigo-200">{character.title}</p>}
        <WikiSection title={t('ballDetail.overview')}>
          <p className="text-base text-slate-300">{character.description ?? t('noDescription')}</p>
        </WikiSection>
      </div>
    </section>
  );
}
