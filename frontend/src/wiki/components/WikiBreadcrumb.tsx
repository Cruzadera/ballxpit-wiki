import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function formatPart(part: string) {
  return part
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function WikiBreadcrumb() {
  const location = useLocation();
  const { t } = useTranslation();

  const parts = location.pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  const makePath = (index: number) => `/${parts.slice(0, index + 1).join('/')}`;

  return (
    <nav className="wiki-breadcrumb" aria-label={t('wiki.breadcrumbLabel', 'Breadcrumb')}>
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const key = part === 'wiki' ? 'menu.home' : `breadcrumb.${part}`;
        const label =
          part === 'wiki'
            ? t('menu.home')
            : t(key, {
                defaultValue: formatPart(part)
              });

        return (
          <span key={makePath(index)}>
            {isLast ? (
              <span aria-current="page">{label}</span>
            ) : (
              <Link to={makePath(index)}>{label}</Link>
            )}
            {!isLast ? ' / ' : null}
          </span>
        );
      })}
    </nav>
  );
}
