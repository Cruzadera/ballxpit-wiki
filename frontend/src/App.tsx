import { BrowserRouter, Routes, Route } from "react-router-dom";
import BallGrid from "./components/BallGrid";
import BallDetail from "./pages/BallDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BallGrid />} />
        <Route path="/ball/:id" element={<BallDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
