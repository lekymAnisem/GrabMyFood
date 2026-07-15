import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useOrders } from '../hooks/useOrders';

export default function OrderHistoryPage() {
  const { orders, fetchOrders, loading, error } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders().catch(() => {});
    }
  }, []);

  function itemsLabel(items) {
    if (typeof items === 'string') return items;
    if (Array.isArray(items)) return items.map(i => i.name || '').join(', ');
    return '';
  }

  function statusKey(s) {
    const map = {
      delivered: 'delivered',
      out_for_delivery: 'out_for_delivery',
      preparing: 'preparing',
      cancelled: 'cancelled',
      OUT_FOR_DELIVERY: 'out_for_delivery',
      PREPARING: 'preparing',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled',
    };
    return map[s] || s?.toLowerCase() || '';
  }

  function dateLabel(order) {
    if (order.date) return order.date;
    if (order.createdAt) return new Date(order.createdAt).toLocaleDateString();
    return '';
  }

  function etaLabel(order) {
    if (order.eta) return order.eta;
    return '';
  }

  const sampleOrders = [
    { id: 1, restaurantName: "L'Anima di Roma", items: 'Truffle Risotto, Salmon Quinoa Bowl', total: 60.99, status: 'delivered', date: '2024-12-15', eta: '12:45 PM' },
    { id: 2, restaurantName: 'The Pizza Lab', items: 'Margherita Pizza, Tiramisu', total: 38.50, status: 'out_for_delivery', date: '2024-12-14', eta: '1:30 PM' },
    { id: 3, restaurantName: 'Burger Theory', items: 'Classic Burger, Fries', total: 28.00, status: 'preparing', date: '2024-12-13', eta: '2:15 PM' },
  ];

  const displayOrders = orders.length > 0 ? orders : sampleOrders;

  const statusColors = {
    delivered: 'bg-tertiary-container text-on-tertiary-container',
    out_for_delivery: 'bg-primary-container text-on-primary-container',
    preparing: 'bg-secondary-container text-on-secondary-container',
    cancelled: 'bg-error-container text-on-error-container',
  };

  const statusLabels = {
    delivered: 'Delivered',
    out_for_delivery: 'Out for Delivery',
    preparing: 'Preparing',
    cancelled: 'Cancelled',
  };

  if (loading) return <LoadingSpinner message="Loading orders..." />;
  if (error) return <div className="pt-32 text-center text-error">{error}</div>;

  return (
    <div className="pt-32 pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">My Orders</h1>
      {displayOrders.length === 0 ? (
        <EmptyState icon="receipt_long" title="No orders yet" description="Your orders will appear here once you place one." actionLabel="Browse Restaurants" onAction={() => navigate('/')} />
      ) : (
        <div className="space-y-4">
          {displayOrders.map(order => {
            const sk = statusKey(order.status);
            return (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}/tracking`)}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 hover:border-primary/30 transition-all cursor-pointer premium-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">{order.restaurantName || order.restaurant}</h3>
                    <p className="text-on-surface-variant text-body-md mt-1">{itemsLabel(order.items)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[sk] || 'bg-surface-container-low text-on-surface-variant'}`}>
                    {statusLabels[sk] || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <div className="flex items-center gap-4 text-on-surface-variant text-label-sm">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span>{dateLabel(order)}</span>
                    {etaLabel(order) && (
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{etaLabel(order)}</span>
                    )}
                  </div>
                  <span className="font-headline-md text-headline-md text-primary">${(order.total ?? 0).toFixed(2)}</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={e => { e.stopPropagation(); navigate(`/orders/${order.id}/tracking`); }} className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
                    Track Order <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <button onClick={e => { e.stopPropagation(); console.log('Reorder:', order.id); }} className="text-on-surface-variant font-label-md text-label-md flex items-center gap-1 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">replay</span> Reorder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
