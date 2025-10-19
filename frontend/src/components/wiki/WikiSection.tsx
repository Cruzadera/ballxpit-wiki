import { ReactNode } from "react";

type WikiSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  variant?: "card" | "plain";
};

export default function WikiSection({ title, children, className, variant = "card" }: WikiSectionProps) {
  const baseClasses =
    variant === "plain"
      ? "bg-transparent border-none shadow-none p-0"
      : "bg-white/70 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700 rounded-2xl shadow-sm p-6";

  return (
    <section className={`${baseClasses} ${className ?? ""}`}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200/70 dark:border-gray-700 pb-3 mb-4">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">{children}</div>
    </section>
  );
}
