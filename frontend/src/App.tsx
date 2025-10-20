import { BrowserRouter } from 'react-router-dom';
import WikiRoutes from './wiki/routes';

export default function App() {
  return (
    <BrowserRouter>
      <WikiRoutes />
    </BrowserRouter>
  );
}
