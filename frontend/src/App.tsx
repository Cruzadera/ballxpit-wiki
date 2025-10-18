import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BallGrid from "./components/BallGrid";
import DarkModeToggle from "./components/DarkModeToggle";
import BallDetail from "./pages/BallDetail";

export default function App() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-slate-100 dark:bg-gray-900/80 backdrop-blur">
        <header className="flex justify-between items-center py-6 px-6 border-b border-gray-200/70 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{t("headerTitle")}</h1>
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
