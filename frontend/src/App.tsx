import { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BallGrid from "./components/BallGrid";
import DarkModeToggle from "./components/DarkModeToggle";
import BallDetail from "./pages/BallDetail";
import CharactersList from "./pages/wiki/characters/CharactersList";
import CharacterDetail from "./pages/wiki/characters/CharacterDetail";

export default function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-slate-100 dark:bg-gray-900/80 backdrop-blur">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6 px-6 border-b border-gray-200/70 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{t("headerTitle")}</h1>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t("home")}
              </Link>
              <Link
                to="/wiki/characters"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t("characters")}
              </Link>
            </nav>
          </div>
          <DarkModeToggle />
        </header>
        <section className="text-center py-6 px-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t("heroTitle")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t("heroSubtitle")}</p>
        </section>
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<BallGrid />} />
            <Route path="/balls/:id" element={<BallDetail />} />
            <Route path="/ball/:id" element={<BallDetail />} />
            <Route path="/wiki/characters" element={<CharactersList />} />
            <Route path="/wiki/characters/:slug" element={<CharacterDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
