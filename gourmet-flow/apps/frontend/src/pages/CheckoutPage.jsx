import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/AddressForm';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../hooks/useCart';

const ADDRESSES = [
  { id: 1, type: 'Home', street: 'Via del Corso 12, Rome', details: 'Interior 4B, 3rd Floor' },
  { id: 2, type: 'Office', street: 'Piazza Navona 44, Rome', details: 'Global Innovations Hub' },
];

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, applyPromo, removePromo, promoCode, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('mastercard');
  const [name, setName] = useState('Alessia Romano');
  const [phone, setPhone] = useState('+39 333 456 7890');
  const [instructions, setInstructions] = useState('');

  const orderData = {
    restaurant: { name: "L'Anima di Roma", cuisine: 'Premium Italian Kitchen', image: '' },
    items,
    subtotal,
    deliveryFee: deliveryMethod === 'priority' ? 2.5 : 0,
    platformFee: 1.50,
    discount: 0,
    total: subtotal + (deliveryMethod === 'priority' ? 2.5 : 0) + 1.50,
  };

  const handlePlaceOrder = () => {
    console.log('Placing order...', { name, phone, instructions, selectedAddress, deliveryMethod, paymentMethod });
    clearCart();
    navigate('/payment');
  };

  return (
    <div className="pt-32 pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-7 space-y-stack-lg">
          <header>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">Finalize Your Order</h1>
            <p className="text-on-surface-variant font-body-md">Confirm your details and we'll prepare your gourmet experience.</p>
          </header>

          <AddressForm addresses={ADDRESSES} selectedAddressId={selectedAddress} onSelect={setSelectedAddress} />

          <section className="bg-surface-container-lowest rounded-2xl p-stack-md premium-shadow border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-stack-md">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              <h2 className="font-headline-md text-headline-md">Delivery Time</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setDeliveryMethod('priority')}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'priority' ? 'bg-white border-2 border-primary/20 shadow-inner' : 'bg-surface-container-low border border-transparent hover:border-primary/20'}`}
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">electric_bolt</span>
                </div>
                <div>
                  <p className="font-bold">Priority</p>
                  <p className="text-label-md text-on-surface-variant">15-25 mins • +€2.50</p>
                </div>
              </div>
              <div
                onClick={() => setDeliveryMethod('standard')}
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'standard' ? 'bg-white border-2 border-primary/20 shadow-inner' : 'bg-surface-container-low border border-transparent hover:border-primary/20'}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">delivery_dining</span>
                </div>
                <div>
                  <p className="font-bold">Standard</p>
                  <p className="text-label-md text-on-surface-variant">35-45 mins • Free</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-2xl p-stack-md premium-shadow border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-stack-md">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              <h2 className="font-headline-md text-headline-md">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-stack-md">
              <div className="space-y-2">
                <label className="text-label-md text-on-surface-variant ml-1">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-transparent focus:border-primary transition-all font-body-md" type="text" />
              </div>
              <div className="space-y-2">
                <label className="text-label-md text-on-surface-variant ml-1">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-transparent focus:border-primary transition-all font-body-md" type="tel" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-label-md text-on-surface-variant ml-1">Delivery Instructions (Optional)</label>
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full bg-surface px-4 py-3 rounded-xl border border-transparent focus:border-primary transition-all font-body-md min-h-[100px]" placeholder="e.g. Please leave at the concierge desk..." />
            </div>
          </section>

          <section className="bg-surface-container-lowest rounded-2xl p-stack-md premium-shadow border border-outline-variant/30">
            <div className="flex items-center gap-3 mb-stack-md">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              <h2 className="font-headline-md text-headline-md">Payment Method</h2>
            </div>
            <div className="space-y-3">
              {[
                { id: 'mastercard', label: 'Mastercard •••• 9928', icon: 'credit_card' },
                { id: 'applepay', label: 'Apple Pay', icon: 'apps' },
                { id: 'paypal', label: 'PayPal', icon: 'account_balance_wallet' },
              ].map(pm => (
                <div
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === pm.id
                      ? 'border-2 border-primary bg-primary-fixed/10'
                      : 'border border-outline-variant/30 hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined ${paymentMethod === pm.id ? 'text-primary' : 'text-on-surface-variant'}`}>{pm.icon}</span>
                    <span className={paymentMethod === pm.id ? 'font-bold' : 'font-medium'}>{pm.label}</span>
                  </div>
                  <span className={`material-symbols-outlined ${paymentMethod === pm.id ? 'text-primary' : 'text-outline-variant'}`}>
                    {paymentMethod === pm.id ? 'radio_button_checked' : 'radio_button_unchecked'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="lg:col-span-5 lg:sticky lg:top-28">
          <OrderSummary order={orderData} onPlaceOrder={handlePlaceOrder} />
        </aside>
      </div>
    </div>
  );
}
