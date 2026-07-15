import { v4 as uuidv4 } from 'uuid';

const VALID_TRANSITIONS = {
  PENDING_PAYMENT: ['PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_CONFIRMED: ['RESTAURANT_CONFIRMED', 'CANCELLED'],
  RESTAURANT_CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_PICKUP: ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
  PAYMENT_FAILED: ['PENDING_PAYMENT', 'CANCELLED'],
};

const orders = new Map();

function seedDemoOrder() {
  const order = {
    id: 'order-1',
    userId: 'u1',
    restaurantId: 'r1',
    restaurantName: "L'Anima di Roma",
    items: [
      { id: uuidv4(), menuItemId: 'mi-t1', name: 'Truffle Tagliatelle', price: 24.00, quantity: 1, specialInstructions: '', selectedAddOns: [], image: '' },
      { id: uuidv4(), menuItemId: 'mi-b1', name: 'Burrata con Pesto', price: 18.00, quantity: 2, specialInstructions: '', selectedAddOns: [], image: '' },
      { id: uuidv4(), menuItemId: 'mi-w1', name: 'Mineral Water', price: 4.50, quantity: 1, specialInstructions: '', selectedAddOns: [], image: '' },
    ],
    subtotal: 64.50,
    deliveryFee: 4.99,
    platformFee: 1.50,
    discount: 21.99,
    total: 49.00,
    promoCode: null,
    status: 'OUT_FOR_DELIVERY',
    deliveryAddress: {
      street: '123 Gourmet Blvd',
      city: 'Foodville',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: 'credit_card',
    specialInstructions: 'Leave at door',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.set(order.id, order);
}

seedDemoOrder();

function getAll(userId) {
  const userOrders = [];
  for (const order of orders.values()) {
    if (order.userId === userId) {
      userOrders.push(order);
    }
  }
  return userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getById(orderId) {
  const order = orders.get(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }
  return { ...order };
}

function create(userId, cartData, { deliveryAddress, paymentMethod, specialInstructions = '' }) {
  const order = {
    id: `order-${uuidv4()}`,
    userId,
    restaurantId: cartData.restaurantId,
    restaurantName: cartData.restaurantName,
    items: cartData.items.map((item) => ({ ...item })),
    subtotal: cartData.subtotal,
    deliveryFee: cartData.deliveryFee,
    platformFee: cartData.platformFee,
    discount: cartData.discount,
    total: cartData.total,
    promoCode: cartData.promoCode || null,
    status: 'PENDING_PAYMENT' ,
    deliveryAddress,
    paymentMethod,
    specialInstructions: specialInstructions || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  order.itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  orders.set(order.id, order);
  return { ...order };
}

function updateStatus(orderId, newStatus, userId) {
  const order = orders.get(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed || !allowed.includes(newStatus)) {
    const err = new Error(`Cannot transition from ${order.status} to ${newStatus}`);
    err.status = 400;
    throw err;
  }

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  return { ...order };
}

function cancel(orderId, userId) {
  const order = orders.get(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  const cancellable = ['PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'RESTAURANT_CONFIRMED', 'PREPARING', 'PAYMENT_FAILED'];
  if (!cancellable.includes(order.status)) {
    const err = new Error(`Order in status ${order.status} cannot be cancelled`);
    err.status = 400;
    throw err;
  }

  order.status = 'CANCELLED';
  order.updatedAt = new Date().toISOString();
  return { ...order };
}

export default {
  getAll,
  getById,
  create,
  updateStatus,
  cancel,
};
