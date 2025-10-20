import { Navigate, Route, Routes } from 'react-router-dom';
import WikiLayout from './components/WikiLayout';
import WikiIndex from './pages/WikiIndex';
import WikiBalls from './pages/WikiBalls';
import WikiEvolutions from './pages/WikiEvolutions';
import WikiCharacters from './pages/WikiCharacters';
import WikiPassives from './pages/WikiPassives';
import WikiAbout from './pages/WikiAbout';

export default function WikiRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/wiki" replace />} />
      <Route element={<WikiLayout />}>
        <Route path="wiki" element={<WikiIndex />} />
        <Route path="wiki/balls" element={<WikiBalls />} />
        <Route path="wiki/evolutions" element={<WikiEvolutions />} />
        <Route path="wiki/characters" element={<WikiCharacters />} />
        <Route path="wiki/passives" element={<WikiPassives />} />
        <Route path="wiki/about" element={<WikiAbout />} />
      </Route>
      <Route path="*" element={<Navigate to="/wiki" replace />} />
    </Routes>
  );
}
