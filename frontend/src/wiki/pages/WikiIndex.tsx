import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const quickLinks = [
  { path: '/wiki/balls', key: 'balls' },
  { path: '/wiki/evolutions', key: 'evolutions' },
  { path: '/wiki/characters', key: 'characters' },
  { path: '/wiki/passives', key: 'passives' }
];

export default function WikiIndex() {
  const { t } = useTranslation();

  return (
    <section className="wiki-section">
      <div className="wiki-intro-card">
        <h3>{t('wiki.index.welcomeTitle')}</h3>
        <p>{t('wiki.index.welcomeDescription')}</p>
      </div>

      <div className="wiki-intro-grid">
        {quickLinks.map((item) => (
          <Link key={item.path} to={item.path} className="wiki-intro-card">
            <h3>{t(`wiki.index.cards.${item.key}.title`)}</h3>
            <p>{t(`wiki.index.cards.${item.key}.description`)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
