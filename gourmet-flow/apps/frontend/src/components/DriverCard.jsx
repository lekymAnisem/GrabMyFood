export default function DriverCard({ driver }) {
  if (!driver) return null;

  return (
    <div className="glass-panel rounded-3xl p-stack-lg shadow-lg flex items-center gap-stack-md">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner">
          <img className="w-full h-full object-cover" src={driver.image} alt={driver.name} />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-tertiary text-white p-1 rounded-full border-2 border-white">
          <span className="material-symbols-outlined text-[14px]">electric_scooter</span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-headline-md text-headline-md text-on-surface">{driver.name}</h3>
        <div className="flex items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="font-label-md text-label-md">{driver.rating} • {driver.orderCount}+ orders</span>
        </div>
      </div>
      <button className="w-12 h-12 rounded-full bg-primary-fixed hover:bg-primary text-primary hover:text-white transition-all flex items-center justify-center active:scale-90">
        <span className="material-symbols-outlined">chat_bubble</span>
      </button>
    </div>
  );
}
