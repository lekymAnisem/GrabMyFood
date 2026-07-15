import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItemHome from '../components/CartItem';
import EmptyState from '../components/EmptyState';

const CROSS_SELL = [
  { id: 101, name: 'Berry Fizz', price: 6.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMfF_R6qa2y6gVH3gKadOjqpYHnp6NbUNwt4oUEHmOK0wKRjYnBZnni_pFqNIeHQ-0qOHwBSa4BB6ymmP9yfx9iKU2g-Wntf5mK9jc-6H_vSZhYJ3BFw4w7g285IZP9fw8Ld61u5SlqUkjxZDiO5Rg-Z1FSN9gNPHnzwtavuUt2yF1F9NTZpFtn63rP1D_ye11Axf483bIdHmA-pKaSHXdjJ6Wk8vfRmMoMmIuvYDeJO_KthU-tteSkkFzOQ01FylhtjRHLeQXu1E' },
  { id: 102, name: 'Garlic Sourdough', price: 4.50, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAufVcJEunJF12Gr8-qQJyrlP-TAeIUKijJ3mSZGJKfmm2cbEjn9Iyes6kuwf2rpYmMI1PkcnZZNQEqAdtxQhewH6gQec_DtXkGzDRZskODoE63AwB_FnK6Q7griGfGzaGnMkOCXy4-_8nT61xaMemlu9FJDkVELZUKI6VtxUtFlP7B51FUUjoRuinShtPwU02tUBZXiESUM3teELAtJ1BwG3STTyRTFkebhzMT8R3wdGit3BzgcC3eI1cgRRzfCjFyIKBZ8J5bK54' },
  { id: 103, name: 'Roasted Roots', price: 8.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsh8cbCAlvHtK9P3Jquc5ThF09OUht0gxCUSMhYdJ7pdb1fcjaouXFuXlcwuQ9yj--t-XFpTgl8p1CsNExXrVM353Rzw-NWkv_MswjHyi5BXRPXta9iaPN_lW7hDjfq9dwAv549IYTDeyG3BfyLc8WKjsDfvZt-LsPPoyeqhnXWtl7kkypfh9x5Ym-Hac34k_iTG71sPNGYvaxkowvWiiwH2UEWjbCuFjDtxaiNsUtOOuYvl4O4-Sn31LO88yM1MoP4MJIE6ir2tk' },
];

export default function CartPage() {
  const { items, subtotal, deliveryFee, total, updateQuantity, removeItem, applyPromo, removePromo, promoCode, itemCount } = useCart();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = () => {
    if (promoInput) applyPromo(promoInput);
  };

  return (
    <div className="pt-32 pb-stack-xl max-w-container-max mx-auto px-margin-desktop">
      <div className="flex flex-col lg:flex-row gap-gutter">
        <div className="flex-grow lg:w-2/3">
          <div className="flex items-center justify-between mb-stack-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Your Cart</h1>
            <span className="text-on-surface-variant font-body-md text-body-md">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
          </div>
          {items.length === 0 ? (
            <EmptyState icon="shopping_basket" title="Your cart is empty" description="Looks like you haven't added anything yet." actionLabel="Browse Restaurants" onAction={() => navigate('/')} />
          ) : (
            <>
              <div className="space-y-stack-md">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-stack-md bg-surface-container-lowest p-stack-md rounded-2xl border border-outline-variant/20 hover:border-primary/20 transition-all premium-shadow group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} alt={item.name} />
                    </div>
                    <div className="flex-grow flex flex-col justify-between h-24">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">{item.name}</h3>
                          {item.description && <p className="text-on-surface-variant font-body-md text-body-md">{item.description}</p>}
                        </div>
                        <p className="font-headline-md text-headline-md text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center bg-surface-container-low rounded-lg p-1 border border-outline-variant/10">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                          </button>
                          <span className="w-8 text-center font-label-md text-label-md">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-on-surface-variant hover:text-error flex items-center gap-1 transition-colors text-label-sm font-label-sm">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-stack-xl">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Frequently bought together</h2>
                <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4">
                  {CROSS_SELL.map(item => (
                    <div key={item.id} className="w-64 flex-shrink-0 bg-surface-container-lowest rounded-[24px] overflow-hidden premium-shadow group cursor-pointer border border-outline-variant/10">
                      <div className="h-40 overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={item.image} alt={item.name} />
                      </div>
                      <div className="p-stack-md">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-label-md text-label-md text-on-surface">{item.name}</h4>
                          <span className="font-label-md text-label-md text-primary">${item.price.toFixed(2)}</span>
                        </div>
                        <button onClick={() => addItem({ ...item, quantity: 1, description: '' }, null)} className="w-full py-2 border border-primary text-primary rounded-xl font-label-md text-label-md hover:bg-primary-container/10 transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">add</span> Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        {items.length > 0 && (
          <div className="lg:w-1/3">
            <div className="sticky top-32 glass-card rounded-[32px] p-stack-lg shadow-2xl">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-lg">Summary</h2>
              <div className="space-y-4 mb-stack-lg">
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant"><span>Platform Fee</span><span>$1.50</span></div>
                <div className="pt-4 border-t border-outline-variant/30 flex justify-between">
                  <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                  <span className="font-headline-md text-headline-md text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mb-stack-lg">
                <div className="relative">
                  <input value={promoInput} onChange={e => setPromoInput(e.target.value)} className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-xl py-3 px-4 font-body-md text-body-md transition-all" placeholder="Promo code" type="text" />
                  <button onClick={handleApplyPromo} className="absolute right-2 top-2 bottom-2 px-4 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-md hover:opacity-80 transition-opacity">Apply</button>
                </div>
                {promoCode && <button onClick={removePromo} className="mt-2 text-xs text-primary underline">Remove promo</button>}
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full bg-primary text-on-primary py-4 rounded-[20px] font-headline-md text-headline-md shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2">
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="mt-6 flex items-center justify-center gap-4">
                <img alt="Visa" className="h-6 opacity-60 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJu-nX_GyXEzfq8xGxz7ZMTaXf4meG_LJHg18okoJCUE-hqMOsnpBXGJyHKfvfpW1YRurg68jYywNFRDvFNmhnTL4mQqFtAWo0tVt8nh2JWPx7SFjTgmEE5yoWp9DpZHCDv-SxKWSMYV6o4QCcNwWyCxBahsm7l0b9gkXLjdURYvujzyAH9tpg-EqyKd0iEkNaUF26_O3Hc6b6lQCD9Onz-7JKdbr6BPfcPMldoSYb8NHLGatGN1aAJNO5Xv4vDP6u00jYGVPF_50" />
                <img alt="Mastercard" className="h-6 opacity-60 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJzif6i5zgPtALx0w-auUdDqVm0T1rgILJK6B3u5YBMD5f0QBOclmUZiY1YcIv-qVtBkTDh5famX5ajz0D5caotA8goyOScOqJti_aUlkvtNbiD8bmA8zn4KhaqDiVxYPasdW9umnDo1KG6MoMJaKqzskICAhynaIJn60wfa5eH-awMy5g1J6BNlvYQ0X9lQmcZaFv6KyPiZYOnLH8bORovybZnqPPwxjgtjYsZO_1hEchtdh46BYsRlkdeVrjMZ-TwI-Jj1jHLW8" />
                <img alt="Apple Pay" className="h-6 opacity-60 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2qkEYIZOtoTQUYi8e02MN7rSpQlRt0gB2qXKbx0-KCQJZDy_NmKIxkdkA5b9t8UVptgbb3cCWX-OtGmGXNMXYJOw-6XuvkjIKcO3P4GBEs8q36zc1M5fC86UlcdRWF3WqRxO4rbf3Ok7fG9gINks2snPW6j6OanUCNXZ8aiUGmBRDNnH5B8hqNrvx3TyvzFOj5q4sF8GI2VOp_r4J_ZhXegcW9C9C_fgRSpv57clBquCEFVubYDDv7Pu280lq9Ht_-4rshRXGyho" />
                <img alt="Google Pay" className="h-6 opacity-60 hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYauql-posQSM7dO7WKAXVJ8k2LQYIZjGUdy0qhsM7LPJNAg8s97tnwGP1-lKn_1W1OG9NjBQLmg58WKDKg3rJSwmp7Ii8JWoWY6hgKTaw0LcRVt6KHdELHOChuL0_Mx0FK_Ai4m4T3AOgm0dQzIAg-d4BGLry4dy3zbNCCDG9_q9-IksYooDQC6dt7SPcb_bleUhLynHIgANFlD14n14CisQKj3UMSpJ1ItARNvJZwkSCuVx7hfPHNrzLrzKz2BYE0FVcMvep_jc" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
