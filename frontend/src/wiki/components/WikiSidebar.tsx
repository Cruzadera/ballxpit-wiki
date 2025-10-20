import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function WikiSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { label: t('menu.home'), path: '/wiki' },
    { label: t('menu.balls'), path: '/wiki/balls' },
    { label: t('menu.evolutions'), path: '/wiki/evolutions' },
    { label: t('menu.characters'), path: '/wiki/characters' },
    { label: t('menu.passives'), path: '/wiki/passives' },
    { label: t('menu.about'), path: '/wiki/about' }
  ];

  const resolveActive = (path: string) => {
    if (path === '/wiki') {
      return location.pathname === '/wiki';
    }

    return location.pathname.startsWith(path);
  };

  return (
    <aside className="wiki-sidebar">
      <nav>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={resolveActive(item.path) ? 'active' : ''}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
