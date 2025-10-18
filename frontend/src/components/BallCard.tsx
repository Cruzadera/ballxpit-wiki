import { Link } from 'react-router-dom';
import { Ball } from '../types';

type Props = {
  ball: Ball;
};

function BallCard({ ball }: Props) {
  return (
    <Link
      to={`/ball/${ball.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <img src={ball.imageUrl} alt={ball.name} className="h-24 w-24 object-contain" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {ball.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Nivel {ball.level}</p>
        </div>
        <span className="mt-auto inline-flex w-fit items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
          {ball.type}
        </span>
      </div>
    </Link>
  );
}

export default BallCard;
