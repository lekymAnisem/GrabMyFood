import { createContext, useState, useCallback, useMemo } from 'react';
import api from '../services/api';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [promoCode, setPromoCode] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const addItem = useCallback(async (item, restaurantId) => {
    setRestaurantId(restaurantId);
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    try { await api.post('/cart/items', { itemId: item.id, restaurantId }); } catch {}
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    setItems(prev => {
      if (quantity <= 0) return prev.filter(i => i.id !== itemId);
      return prev.map(i => i.id === itemId ? { ...i, quantity } : i);
    });
    try { api.put(`/cart/items/${itemId}`, { quantity }); } catch {}
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    if (items.length <= 1) setRestaurantId(null);
    try { api.delete(`/cart/items/${itemId}`); } catch {}
  }, [items.length]);

  const applyPromo = useCallback(async (code) => {
    setPromoCode(code);
    setPromoDiscount(0.1);
    try {
      const res = await api.post('/cart/promo', { code });
      if (res.data.discount) setPromoDiscount(res.data.discount);
    } catch {}
  }, []);

  const removePromo = useCallback(() => {
    setPromoCode(null);
    setPromoDiscount(0);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setPromoCode(null);
    setPromoDiscount(0);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0), [items]);
  const deliveryFee = useMemo(() => subtotal > 30 ? 0 : 4.99, [subtotal]);
  const discount = useMemo(() => promoDiscount * subtotal, [promoDiscount, subtotal]);
  const total = useMemo(() => subtotal + deliveryFee - discount, [subtotal, deliveryFee, discount]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{
      items, restaurantId, subtotal, deliveryFee, discount, total, promoCode, itemCount,
      addItem, updateQuantity, removeItem, applyPromo, removePromo, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}
