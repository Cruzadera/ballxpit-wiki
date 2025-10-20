import type { ReactNode } from 'react';

export type WikiCardProps = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  children?: ReactNode;
};

export default function WikiCard({ title, description, imageUrl, children }: WikiCardProps) {
  return (
    <div className="wiki-card">
      {imageUrl ? <img src={imageUrl} alt={title} loading="lazy" /> : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {children}
    </div>
  );
}
