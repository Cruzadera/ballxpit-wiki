import { useEffect, useState } from 'react';

const storageKey = 'ballxpit-theme';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const saved = window.localStorage.getItem(storageKey) as Theme | null;
  if (saved) {
    return saved;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  const handleToggle = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
    >
      <span className="text-lg" aria-hidden>
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
      {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
    </button>
  );
}

export default ThemeToggle;
