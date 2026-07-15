export default function AddressForm({ addresses, selectedAddressId, onSelect }) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl p-stack-md premium-shadow border border-outline-variant/30">
      <div className="flex items-center gap-3 mb-stack-md">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
        <h2 className="font-headline-md text-headline-md">Delivery Address</h2>
      </div>
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-stack-md bg-surface-container-low">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary p-2 rounded-full shadow-lg ring-4 ring-white/50">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses?.map(addr => (
          <label key={addr.id} className="relative group cursor-pointer">
            <input
              checked={selectedAddressId === addr.id}
              onChange={() => onSelect(addr.id)}
              className="peer sr-only"
              name="address"
              type="radio"
            />
            <div className="p-4 rounded-xl border-2 border-outline-variant/50 peer-checked:border-primary peer-checked:bg-primary-fixed/20 transition-all hover:bg-surface-container-low">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-label-sm font-label-sm px-2 py-0.5 rounded-full ${addr.type === 'Home' ? 'bg-secondary-container text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>{addr.type}</span>
                <span className={`material-symbols-outlined text-primary ${selectedAddressId === addr.id ? 'opacity-100' : 'opacity-0'} transition-opacity`}>check_circle</span>
              </div>
              <p className="font-bold text-on-surface">{addr.street}</p>
              <p className="text-on-surface-variant text-label-md">{addr.details}</p>
            </div>
          </label>
        ))}
        {(!addresses || addresses.length === 0) && (
          <div className="col-span-2 p-4 text-center text-on-surface-variant">No saved addresses</div>
        )}
      </div>
    </section>
  );
}
