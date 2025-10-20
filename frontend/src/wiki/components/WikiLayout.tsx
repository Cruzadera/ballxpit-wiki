import { Outlet } from 'react-router-dom';
import WikiSidebar from './WikiSidebar';
import WikiBreadcrumb from './WikiBreadcrumb';
import LanguageToggle from './LanguageToggle';
import '../wiki.css';

export default function WikiLayout() {
  return (
    <div className="wiki-layout">
      <WikiSidebar />
      <div className="wiki-content">
        <header>
          <h1>Ball x Pit Wiki</h1>
          <LanguageToggle />
        </header>
        <WikiBreadcrumb />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
