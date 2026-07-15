import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="block bg-surface rounded-[1.5rem] overflow-hidden dish-card-shadow border border-outline-variant/30 hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={restaurant.image} alt={restaurant.name} />
        <div className="absolute top-4 left-4 glass-effect px-3 py-1 rounded-full text-xs font-bold text-on-surface flex items-center gap-1">
          <span className="material-symbols-outlined text-xs text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          {restaurant.rating} ({restaurant.reviewCount}+)
        </div>
        <button onClick={e => { e.preventDefault(); console.log('Favorite:', restaurant.id); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-primary transition-colors">
          <span className="material-symbols-outlined text-sm">favorite</span>
        </button>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-headline-md text-[18px] text-on-surface">{restaurant.name}</h4>
          <span className="bg-secondary-container text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">{restaurant.priceLevel}</span>
        </div>
        <p className="text-on-surface-variant text-label-sm mb-4">{restaurant.cuisine}</p>
        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-4">
          <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {restaurant.deliveryTime}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
            <span className="material-symbols-outlined text-sm">delivery_dining</span>
            {restaurant.deliveryFee}
          </div>
        </div>
      </div>
    </Link>
  );
}
