import { BrowserRouter, Route, Routes } from "react-router-dom";
import BallGrid from "./components/BallGrid";
import BallDetail from "./pages/BallDetail";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen text-gray-900 dark:text-gray-100">
        <header className="py-6 text-center border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 backdrop-blur">
          <div className="max-w-4xl mx-auto px-4 relative">
            <h1 className="text-3xl font-extrabold text-indigo-600">⚪ Ball x Pit Wiki</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Explora las bolas, sus fusiones y evoluciones elementales.
            </p>
          </div>
        </header>
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
