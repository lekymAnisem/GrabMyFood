import { useState } from 'react';

export default function OrderSummary({ order, onPlaceOrder }) {
  const [promo, setPromo] = useState('');

  const handleApplyPromo = () => {
    if (order?.onApplyPromo) order.onApplyPromo(promo);
  };

  return (
    <div className="bg-surface rounded-2xl p-stack-md border border-outline-variant/30 shadow-xl overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
      <h2 className="font-headline-md text-headline-md mb-stack-md">Order Summary</h2>
      {order?.restaurant && (
        <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${order.restaurant.image})` }} />
          <div>
            <p className="font-bold text-on-surface">{order.restaurant.name}</p>
            <p className="text-label-sm text-on-surface-variant">{order.restaurant.cuisine}</p>
          </div>
        </div>
      )}
      <div className="space-y-4 mb-stack-md border-b border-outline-variant/30 pb-stack-md">
        {order?.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start">
            <div className="flex gap-3">
              <span className="text-primary font-bold">{item.quantity}×</span>
              <div>
                <p className="font-medium">{item.name}</p>
                {item.description && <p className="text-label-sm text-on-surface-variant">{item.description}</p>}
              </div>
            </div>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 mb-stack-lg">
        <div className="flex justify-between text-body-md text-on-surface-variant"><span>Subtotal</span><span>${(order?.subtotal || 0).toFixed(2)}</span></div>
        <div className="flex justify-between text-body-md text-on-surface-variant"><span>Delivery Fee</span><span className="text-tertiary">{order?.deliveryFee === 0 ? 'Free' : `$${(order?.deliveryFee || 0).toFixed(2)}`}</span></div>
        <div className="flex justify-between text-body-md text-on-surface-variant"><span>Platform Fee</span><span>${(order?.platformFee || 0).toFixed(2)}</span></div>
        {order?.discount > 0 && <div className="flex justify-between text-body-md text-tertiary"><span>Discount</span><span>-${(order.discount).toFixed(2)}</span></div>}
        <div className="flex justify-between font-headline-md text-headline-md pt-2 border-t border-outline-variant/20">
          <span>Total</span><span className="text-primary">${(order?.total || 0).toFixed(2)}</span>
        </div>
      </div>
      <div className="flex gap-2 mb-stack-md">
        <input value={promo} onChange={e => setPromo(e.target.value)} className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-2 text-label-md" placeholder="Promo code" type="text" />
        <button onClick={handleApplyPromo} className="bg-secondary-container text-primary font-bold px-4 py-2 rounded-xl text-label-md hover:bg-primary-fixed/30 transition-all">Apply</button>
      </div>
      {onPlaceOrder && (
        <button onClick={onPlaceOrder} className="w-full bg-primary text-on-primary py-4 rounded-xl text-white font-bold text-body-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2 group">
          <span>Place Order</span>
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">chevron_right</span>
        </button>
      )}
      <div className="mt-6 flex justify-center gap-6 opacity-60">
        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">verified_user</span><span className="text-label-sm">Secure Payment</span></div>
        <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">eco</span><span className="text-label-sm">Eco Packaging</span></div>
      </div>
    </div>
  );
}
