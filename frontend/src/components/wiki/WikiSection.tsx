import { ReactNode } from 'react';

interface WikiSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function WikiSection({ title, subtitle, children }: WikiSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}
