import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from './CartItem';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem, restaurantId } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 right-0 w-96 z-[60] bg-surface shadow-2xl transition-transform duration-500 ease-in-out border-l border-outline-variant ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full py-6">
          <div className="px-6 mb-8 flex justify-between items-start">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">Your Cart</h2>
              <p className="text-on-surface-variant text-label-md font-label-md">Premium Selection</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex-1 px-2 space-y-2 overflow-y-auto">
            {items.length === 0 ? (
              <div className="bg-surface-container-high rounded-2xl p-6 mb-6 flex flex-col items-center justify-center border border-dashed border-outline mx-4">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">shopping_basket</span>
                <p className="text-on-surface-variant text-center">Your cart is empty.</p>
              </div>
            ) : (
              items.map(item => (
                <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
              ))
            )}
          </div>
          <div className="px-6 space-y-4">
            {items.length > 0 && (
              <div className="pt-4 border-t border-outline-variant/30 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Delivery Fee</span><span className={deliveryFee === 0 ? 'text-tertiary' : ''}>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
              </div>
            )}
            <button
              onClick={() => { navigate('/checkout'); onClose(); }}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl shadow-lg active:opacity-80 transition-opacity"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
