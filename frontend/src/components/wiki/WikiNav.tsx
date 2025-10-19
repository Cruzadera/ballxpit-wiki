import { Link } from 'react-router-dom';
import type { WikiSection } from '../../types/wiki';

interface WikiNavProps {
  sections: WikiSection[];
  currentPath: string;
}

export default function WikiNav({ sections, currentPath }: WikiNavProps) {
  return (
    <nav className="flex flex-wrap gap-2 text-sm">
      {sections.map((section) => {
        const isActive = currentPath.startsWith(section.path);

        return (
          <Link
            key={section.path}
            to={section.path}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
              isActive
                ? 'border-indigo-400/80 bg-indigo-500/10 text-indigo-400'
                : 'border-slate-600/30 text-slate-400 hover:border-indigo-400/50 hover:text-indigo-300'
            }`}
          >
            <span aria-hidden>{section.icon}</span>
            <span className="font-medium">{section.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
