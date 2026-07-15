export default function MenuItemCard({ item, onAddToCart }) {
  return (
    <div className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xxl overflow-hidden dish-card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} alt={item.name} />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-md">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
        </div>
      </div>
      <div className="p-stack-md flex flex-col gap-stack-sm">
        <div className="flex justify-between items-start">
          <h4 className="font-headline-md text-headline-md text-on-surface">{item.name}</h4>
          <span className="font-headline-md text-primary">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-on-surface-variant text-body-md line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-stack-sm">
          <div className="flex gap-2">
            {item.calories && (
              <span className="text-xs font-label-sm px-2 py-1 bg-surface-container-low rounded-lg text-on-surface-variant">{item.calories} kcal</span>
            )}
            {item.tags?.map(tag => (
              <span key={tag} className="text-xs font-label-sm px-2 py-1 bg-surface-container-low rounded-lg text-on-surface-variant">{tag}</span>
            ))}
          </div>
          <button onClick={() => onAddToCart?.(item)} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
