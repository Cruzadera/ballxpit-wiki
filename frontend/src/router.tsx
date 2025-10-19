import { Navigate, createBrowserRouter } from 'react-router-dom';
import WikiLayout from './components/wiki/WikiLayout';
import BallsPage from './pages/wiki/BallsPage';
import BallDetail from './pages/wiki/BallDetail';
import FusionsPage from './pages/wiki/FusionsPage';
import FusionDetail from './pages/wiki/FusionDetail';
import EvolutionsPage from './pages/wiki/EvolutionsPage';
import EvolutionDetail from './pages/wiki/EvolutionDetail';
import CharactersPage from './pages/wiki/CharactersPage';
import CharacterDetail from './pages/wiki/CharacterDetail';
import ItemsPage from './pages/wiki/ItemsPage';
import ItemDetail from './pages/wiki/ItemDetail';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/wiki/balls" replace /> },
  {
    path: '/wiki',
    element: <WikiLayout />,
    children: [
      { index: true, element: <Navigate to="balls" replace /> },
      { path: 'balls', element: <BallsPage /> },
      { path: 'balls/:slug', element: <BallDetail /> },
      { path: 'fusions', element: <FusionsPage /> },
      { path: 'fusions/:slug', element: <FusionDetail /> },
      { path: 'evolutions', element: <EvolutionsPage /> },
      { path: 'evolutions/:slug', element: <EvolutionDetail /> },
      { path: 'characters', element: <CharactersPage /> },
      { path: 'characters/:slug', element: <CharacterDetail /> },
      { path: 'items', element: <ItemsPage /> },
      { path: 'items/:slug', element: <ItemDetail /> }
    ]
  },
  { path: '*', element: <Navigate to="/wiki/balls" replace /> }
]);
