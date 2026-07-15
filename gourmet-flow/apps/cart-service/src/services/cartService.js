import { v4 as uuidv4 } from 'uuid';

const DEFAULT_DELIVERY_FEE = 4.99;
const PLATFORM_FEE = 1.50;

const PROMO_CODES = {
  FLOW50: { type: 'percentage', value: 50, description: '50% off subtotal' },
};

const carts = new Map();

function seedDemoCart() {
  const demoCart = {
    id: 'cart-demo-1',
    userId: 'u1',
    restaurantId: 'r1',
    restaurantName: "L'Anima di Roma",
    items: [
      {
        id: uuidv4(),
        menuItemId: 'mi-1',
        name: 'Truffle Risotto',
        price: 24.00,
        quantity: 1,
        specialInstructions: 'Extra Parmesan',
        selectedAddOns: [],
        image: '',
      },
      {
        id: uuidv4(),
        menuItemId: 'mi-2',
        name: 'Salmon Quinoa Bowl',
        price: 18.50,
        quantity: 1,
        specialInstructions: 'Lemon Vinaigrette',
        selectedAddOns: [],
        image: '',
      },
      {
        id: uuidv4(),
        menuItemId: 'mi-3',
        name: 'Gold Leaf Ganache',
        price: 12.00,
        quantity: 1,
        specialInstructions: 'Artisanal Dessert',
        selectedAddOns: [],
        image: '',
      },
    ],
    promoCode: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  carts.set(demoCart.userId, demoCart);
}

seedDemoCart();

function calculateTotals(cart) {
  const subtotal = cart.items.reduce((sum, item) => {
    const addOnsTotal = item.selectedAddOns.reduce((a, o) => a + o.price, 0);
    return sum + (item.price + addOnsTotal) * item.quantity;
  }, 0);

  const deliveryFee = DEFAULT_DELIVERY_FEE;

  let discount = 0;
  if (cart.promoCode && PROMO_CODES[cart.promoCode]) {
    const promo = PROMO_CODES[cart.promoCode];
    if (promo.type === 'percentage') {
      discount = subtotal * (promo.value / 100);
    } else if (promo.type === 'fixed') {
      discount = promo.value;
    }
    discount = Math.min(discount, subtotal);
    discount = Math.round(discount * 100) / 100;
  }

  const total = Math.round((subtotal + deliveryFee - discount + PLATFORM_FEE) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee,
    platformFee: PLATFORM_FEE,
    discount,
    total,
  };
}

function getCart(userId) {
  let cart = carts.get(userId);
  if (!cart) {
    cart = {
      id: `cart-${uuidv4()}`,
      userId,
      restaurantId: null,
      restaurantName: null,
      items: [],
      promoCode: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    carts.set(userId, cart);
  }
  const totals = calculateTotals(cart);
  return { ...cart, ...totals };
}

function addItem(userId, { restaurantId, menuItemId, name, price, quantity, specialInstructions = '', selectedAddOns = [], image = '' }) {
  let cart = carts.get(userId);
  if (!cart) {
    cart = {
      id: `cart-${uuidv4()}`,
      userId,
      restaurantId: null,
      restaurantName: null,
      items: [],
      promoCode: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    carts.set(userId, cart);
  }

  if (cart.restaurantId && cart.restaurantId !== restaurantId && cart.items.length > 0) {
    const err = new Error(`Cart already contains items from "${cart.restaurantName}". Clear cart or use a different session.`);
    err.status = 409;
    throw err;
  }

  cart.restaurantId = restaurantId;
  cart.restaurantName = name ? name.split(' ').slice(0, 2).join(' ') || restaurantId : restaurantId;

  const existingItem = cart.items.find((i) => i.menuItemId === menuItemId);
  if (existingItem) {
    existingItem.quantity += quantity;
    if (specialInstructions) existingItem.specialInstructions = specialInstructions;
    if (selectedAddOns.length) existingItem.selectedAddOns = selectedAddOns;
  } else {
    cart.items.push({
      id: uuidv4(),
      menuItemId,
      name: name || 'Unknown Item',
      price,
      quantity,
      specialInstructions,
      selectedAddOns,
      image,
    });
  }

  cart.updatedAt = new Date().toISOString();
  const totals = calculateTotals(cart);
  return { ...cart, ...totals };
}

function updateItemQuantity(userId, cartItemId, quantity) {
  const cart = carts.get(userId);
  if (!cart) {
    const err = new Error('Cart not found');
    err.status = 404;
    throw err;
  }

  const item = cart.items.find((i) => i.id === cartItemId);
  if (!item) {
    const err = new Error('Item not found in cart');
    err.status = 404;
    throw err;
  }

  item.quantity = quantity;
  cart.updatedAt = new Date().toISOString();
  const totals = calculateTotals(cart);
  return { ...cart, ...totals };
}

function removeItem(userId, cartItemId) {
  const cart = carts.get(userId);
  if (!cart) {
    const err = new Error('Cart not found');
    err.status = 404;
    throw err;
  }

  const index = cart.items.findIndex((i) => i.id === cartItemId);
  if (index === -1) {
    const err = new Error('Item not found in cart');
    err.status = 404;
    throw err;
  }

  cart.items.splice(index, 1);

  if (cart.items.length === 0) {
    cart.restaurantId = null;
    cart.restaurantName = null;
  }

  cart.updatedAt = new Date().toISOString();
  const totals = calculateTotals(cart);
  return { ...cart, ...totals };
}

function applyPromoCode(userId, code) {
  const cart = carts.get(userId);
  if (!cart) {
    const err = new Error('Cart not found');
    err.status = 404;
    throw err;
  }

  if (!PROMO_CODES[code]) {
    const err = new Error('Invalid promo code');
    err.status = 400;
    throw err;
  }

  cart.promoCode = code;
  cart.updatedAt = new Date().toISOString();
  const totals = calculateTotals(cart);
  return { ...cart, ...totals };
}

function removePromoCode(userId) {
  const cart = carts.get(userId);
  if (!cart) {
    const err = new Error('Cart not found');
    err.status = 404;
    throw err;
  }

  cart.promoCode = null;
  cart.updatedAt = new Date().toISOString();
  const totals = calculateTotals(cart);
  return { ...cart, ...totals };
}

function clearCart(userId) {
  const cart = carts.get(userId);
  if (!cart) {
    const err = new Error('Cart not found');
    err.status = 404;
    throw err;
  }

  cart.items = [];
  cart.restaurantId = null;
  cart.restaurantName = null;
  cart.promoCode = null;
  cart.updatedAt = new Date().toISOString();
  const totals = calculateTotals(cart);
  return { ...cart, ...totals };
}

function getCartRaw(userId) {
  return carts.get(userId) || null;
}

export default {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  applyPromoCode,
  removePromoCode,
  clearCart,
  getCartRaw,
};
