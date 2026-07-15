import { createContext, useState, useCallback } from 'react';
import api from '../services/api';

export const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/orders', orderData);
      setCurrentOrder(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/orders/${id}`);
      setCurrentOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/orders/${id}/cancel`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  }, []);

  const trackDelivery = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/delivery/${orderId}`);
      setDeliveryInfo(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track delivery');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <OrderContext.Provider value={{
      orders, currentOrder, deliveryInfo, loading, error,
      createOrder, fetchOrders, fetchOrder, cancelOrder, trackDelivery,
    }}>
      {children}
    </OrderContext.Provider>
  );
}
