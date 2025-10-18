import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BallDetailPage from './pages/BallDetailPage';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12">
        <header className="flex flex-col gap-4 border-b border-slate-200 py-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            🧩 Ball x Pit Wiki
          </Link>
          <ThemeToggle />
        </header>
        <main className="flex-1 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ball/:id" element={<BallDetailPage />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Datos demostrativos inspirados en Ball x Pit. Proyecto fan sin afiliación oficial.
        </footer>
      </div>
    </div>
  );
}

export default App;
