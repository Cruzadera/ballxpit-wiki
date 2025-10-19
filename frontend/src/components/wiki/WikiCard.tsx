import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface WikiCardProps {
  to: string;
  title: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags?: string[];
}

export default function WikiCard({ to, title, description, imageUrl, tags }: WikiCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={to}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/40 bg-slate-900/50 transition-transform duration-200 hover:-translate-y-1 hover:border-indigo-400/70 hover:shadow-lg hover:shadow-indigo-500/20"
    >
      {imageUrl ? (
        <div className="h-40 w-full overflow-hidden bg-slate-800">
          <img
            src={imageUrl}
            alt={title ?? ''}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center bg-slate-800/70 text-4xl" aria-hidden>
          🜂
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-300"
            >
              {t(`tags.${tag}`)}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-slate-100">{title ?? t('noTitle', { defaultValue: 'Unnamed entry' })}</h3>
        <p className="line-clamp-3 text-sm text-slate-400">{description ?? t('noDescription', { defaultValue: 'No description available yet.' })}</p>
      </div>
    </Link>
  );
}
