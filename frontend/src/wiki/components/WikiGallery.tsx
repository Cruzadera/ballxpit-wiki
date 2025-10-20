import WikiCard, { type WikiCardProps } from './WikiCard';

type WikiGalleryProps = {
  items: WikiCardProps[];
};

export default function WikiGallery({ items }: WikiGalleryProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="wiki-gallery">
      {items.map((item, index) => (
        <WikiCard key={`${item.title}-${index}`} {...item} />
      ))}
    </div>
  );
}
