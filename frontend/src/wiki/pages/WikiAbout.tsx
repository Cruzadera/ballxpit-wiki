import { useTranslation } from 'react-i18next';

export default function WikiAbout() {
  const { t } = useTranslation();

  return (
    <div className="wiki-about">
      <section>
        <h2>{t('wiki.about.mission.title')}</h2>
        <p>{t('wiki.about.mission.body')}</p>
      </section>

      <section>
        <h2>{t('wiki.about.data.title')}</h2>
        <p>{t('wiki.about.data.body')}</p>
        <ul>
          <li>{t('wiki.about.data.points.balls')}</li>
          <li>{t('wiki.about.data.points.evolutions')}</li>
          <li>{t('wiki.about.data.points.characters')}</li>
          <li>{t('wiki.about.data.points.passives')}</li>
        </ul>
      </section>

      <section>
        <h2>{t('wiki.about.design.title')}</h2>
        <p>{t('wiki.about.design.body')}</p>
      </section>
    </div>
  );
}
