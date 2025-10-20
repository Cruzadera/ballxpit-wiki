import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: '🇬🇧', aria: 'English' },
  { code: 'es', label: '🇪🇸', aria: 'Español' }
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const handleChange = (code: string) => {
    if (code !== i18n.language) {
      void i18n.changeLanguage(code);
    }
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Language selector">
      {LANGUAGES.map(({ code, label, aria }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChange(code)}
          className={i18n.language === code ? 'active' : ''}
          aria-pressed={i18n.language === code}
          aria-label={aria}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
