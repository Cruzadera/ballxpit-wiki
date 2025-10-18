import { useEffect, useState } from "react";
import { useTranslations } from "../i18n/translations";

const THEME_STORAGE_KEY = "theme";

type ThemePreference = "light" | "dark";

function readInitialTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") {
    return stored;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(() => readInitialTheme());
  const texts = useTranslations();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleDarkMode}
      className="rounded-full px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      type="button"
    >
      {isDark ? texts.darkModeLight : texts.darkModeDark}
    </button>
  );
}
