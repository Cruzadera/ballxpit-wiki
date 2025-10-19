import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type WikiBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function WikiBreadcrumb({ items }: WikiBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 dark:text-gray-400">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-gray-900 dark:text-gray-100" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="mx-2 text-gray-400">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
