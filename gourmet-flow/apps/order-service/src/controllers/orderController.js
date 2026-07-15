import orderService from '../services/orderService.js';
import config from '../config/index.js';

export async function createOrder(req, res, next) {
  try {
    const cartRes = await fetch(`${config.cartServiceUrl}/cart`, {
      headers: { Authorization: req.headers.authorization || '' },
    });

    if (!cartRes.ok) {
      const err = new Error('Failed to fetch cart data');
      err.status = 502;
      throw err;
    }

    const cartData = await cartRes.json();

    if (!cartData.items || cartData.items.length === 0) {
      const err = new Error('Cart is empty');
      err.status = 400;
      throw err;
    }

    const order = orderService.create(req.userId, cartData, req.validatedBody);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export function getOrders(req, res, next) {
  try {
    const orders = orderService.getAll(req.userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export function getOrderById(req, res, next) {
  try {
    const order = orderService.getById(req.params.orderId);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.validatedBody;
    const order = orderService.updateStatus(req.params.orderId, status, req.userId);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export function cancelOrder(req, res, next) {
  try {
    const order = orderService.cancel(req.params.orderId, req.userId);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export function health(_req, res) {
  res.json({ status: 'ok', service: 'order-service', timestamp: new Date().toISOString() });
}

export function ready(_req, res) {
  res.json({ status: 'ready', service: 'order-service', timestamp: new Date().toISOString() });
}
