import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchWiki } from '../../utils/wikiApi';
import type { WikiSection } from '../../types/wiki';
import WikiNav from './WikiNav';
import WikiSearch from './WikiSearch';

interface MetaResponse {
  sections: WikiSection[];
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    const stored = window.localStorage.getItem('ballxpit-theme');
    if (stored) {
      return stored === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ballxpit-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark((value) => !value);

  return { isDark, toggle };
};

export type WikiLayoutContext = {
  searchTerm: string;
  setDetailBreadcrumb: (label: string | null) => void;
};

export default function WikiLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isDark, toggle } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [sections, setSections] = useState<WikiSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [detailBreadcrumb, setDetailBreadcrumb] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setHasError(false);

    fetchWiki<MetaResponse>('/meta')
      .then((response) => {
        if (mounted) {
          setSections(response.sections);
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

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);

    const items = segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const label = t(`breadcrumbs.${segment}`, { defaultValue: segment });
      return { path, label };
    });

    const resolved = [{ path: '/wiki', label: t('breadcrumbs.wiki') }, ...items.filter((item) => item.path !== '/wiki')];

    if (detailBreadcrumb && resolved.length > 0) {
      resolved[resolved.length - 1] = {
        ...resolved[resolved.length - 1],
        label: detailBreadcrumb
      };
    }

    return resolved;
  }, [detailBreadcrumb, location.pathname, t]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    setDetailBreadcrumb(null);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-700/40 bg-slate-900/60 p-8 shadow-lg shadow-indigo-500/5">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <Link to="/wiki" className="text-3xl font-black tracking-tight text-indigo-300">
                Ball x Pit Wiki
              </Link>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-slate-500">
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.path} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden>/</span>}
                    <Link to={crumb.path} className="hover:text-indigo-200">
                      {crumb.label}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="self-start rounded-full border border-slate-600/40 bg-slate-800/60 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-indigo-400/70 hover:text-indigo-200"
            >
              {isDark ? '☾' : '☀︎'} {t('layout.darkMode')}
            </button>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <WikiNav sections={sections} currentPath={location.pathname} />
            <WikiSearch
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder={t('search.placeholder')}
            />
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center rounded-3xl border border-slate-700/40 bg-slate-900/40 p-10 text-lg text-slate-400">
            {t('loading')}
          </div>
        ) : hasError ? (
          <div className="flex flex-1 items-center justify-center rounded-3xl border border-rose-500/40 bg-rose-950/40 p-10 text-lg text-rose-200">
            {t('error')}
          </div>
        ) : (
          <main className="flex-1">
            <Outlet context={{ searchTerm, setDetailBreadcrumb }} />
          </main>
        )}
      </div>
    </div>
  );
}
