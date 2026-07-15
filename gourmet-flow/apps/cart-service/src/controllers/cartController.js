import cartService from '../services/cartService.js';

export function getCart(req, res, next) {
  try {
    const cart = cartService.getCart(req.userId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export function addItem(req, res, next) {
  try {
    const cart = cartService.addItem(req.userId, req.validatedBody);
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
}

export function updateItemQuantity(req, res, next) {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.validatedBody;
    const cart = cartService.updateItemQuantity(req.userId, cartItemId, quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export function removeItem(req, res, next) {
  try {
    const { cartItemId } = req.params;
    const cart = cartService.removeItem(req.userId, cartItemId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export function applyPromoCode(req, res, next) {
  try {
    const { code } = req.validatedBody;
    const cart = cartService.applyPromoCode(req.userId, code);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export function removePromoCode(req, res, next) {
  try {
    const cart = cartService.removePromoCode(req.userId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export function clearCart(req, res, next) {
  try {
    const cart = cartService.clearCart(req.userId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
}

export function health(_req, res) {
  res.json({ status: 'ok', service: 'cart-service', timestamp: new Date().toISOString() });
}

export function ready(_req, res) {
  res.json({ status: 'ready', service: 'cart-service', timestamp: new Date().toISOString() });
}
