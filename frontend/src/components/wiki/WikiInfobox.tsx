import { ReactNode } from "react";

type WikiInfoboxItem = {
  label: string;
  value: ReactNode;
};

type WikiInfoboxProps = {
  title: string;
  subtitle?: string;
  items: WikiInfoboxItem[];
};

export default function WikiInfobox({ title, subtitle, items }: WikiInfoboxProps) {
  return (
    <aside className="w-full lg:w-80 bg-white dark:bg-gray-900 border border-indigo-200/70 dark:border-indigo-500/40 rounded-2xl shadow-md overflow-hidden">
      <div className="bg-indigo-500/10 dark:bg-indigo-500/20 px-5 py-4 border-b border-indigo-200/60 dark:border-indigo-500/40">
        <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-snug">{subtitle}</p>
        )}
      </div>
      <dl className="divide-y divide-gray-200/70 dark:divide-gray-800">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="px-5 py-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              {item.label}
            </dt>
            <dd className="text-base font-medium text-gray-900 dark:text-gray-100">{item.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
