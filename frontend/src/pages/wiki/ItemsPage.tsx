import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WikiCard from '../../components/wiki/WikiCard';
import WikiSection from '../../components/wiki/WikiSection';
import { useWikiLayout } from '../../hooks/useWikiLayout';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiItem } from '../../types/wiki';

export default function ItemsPage() {
  const { t, i18n } = useTranslation();
  const { searchTerm } = useWikiLayout();
  const [items, setItems] = useState<WikiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<WikiItem[]>('/items')
      .then((data) => {
        if (mounted) {
          setItems(data);
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

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }

    return items.filter((item) => {
      const target = `${item.name ?? ''} ${item.description ?? ''} ${item.type ?? ''}`.toLowerCase();
      return target.includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  if (isLoading) {
    return <div className="text-sm text-slate-400">{t('loading')}</div>;
  }

  if (hasError) {
    return <div className="text-sm text-rose-300">{t('error')}</div>;
  }

  return (
    <WikiSection title={t('pages.items.title')} subtitle={t('pages.items.subtitle')}>
      {filteredItems.length === 0 ? (
        <p className="text-sm text-slate-400">{t('noResults')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <WikiCard
              key={item.slug}
              to={`/wiki/items/${item.slug}`}
              title={item.name}
              description={item.description ?? item.type}
              imageUrl={item.imageUrl ?? undefined}
            />
          ))}
        </div>
      )}
    </WikiSection>
  );
}
