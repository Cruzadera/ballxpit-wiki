import { BrowserRouter, Route, Routes } from "react-router-dom";
import BallGrid from "./components/BallGrid";
import DarkModeToggle from "./components/DarkModeToggle";
import { useTranslations } from "./i18n/translations";
import BallDetail from "./pages/BallDetail";

export default function App() {
  const texts = useTranslations();

  return (
    <BrowserRouter>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-white/60 dark:bg-gray-900/80 backdrop-blur">
        <header className="flex justify-between items-center py-6 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">⚪ Ball x Pit Wiki</h1>
          <DarkModeToggle />
        </header>
        <section className="text-center py-6 px-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{texts.heroTitle}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{texts.heroSubtitle}</p>
        </section>
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<BallGrid />} />
            <Route path="/ball/:id" element={<BallDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
