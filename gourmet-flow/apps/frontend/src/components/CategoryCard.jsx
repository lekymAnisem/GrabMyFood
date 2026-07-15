export default function CategoryCard({ name, imageUrl, onClick }) {
  return (
    <div onClick={() => onClick?.(name)} className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer">
      <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center border border-outline-variant/30 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300 overflow-hidden shadow-sm">
        <img className="w-14 h-14 object-contain transition-transform group-hover:scale-110" src={imageUrl} alt={name} />
      </div>
      <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">{name}</span>
    </div>
  );
}
