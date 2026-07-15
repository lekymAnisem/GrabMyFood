import { v4 as uuidv4 } from 'uuid';

const deliveries = new Map();

const seedDelivery = {
  id: 'del-1',
  orderId: 'order-1',
  driverId: 'driver-1',
  driver: {
    name: 'Marco Santoro',
    rating: 4.9,
    ordersCompleted: 2400,
    photoUrl: 'https://raw.githubusercontent.com/andrewnguyen12/grab-ui-clone/main/public/driver.jpg',
  },
  status: 'ON_THE_WAY',
  estimatedArrival: '12-18 mins',
  location: { lat: 41.9028, lng: 12.4964 },
  deliveryAddress: 'Via del Corso 22, Rome, Italy',
  restaurantId: 'rest-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
deliveries.set('del-1', seedDelivery);

export async function createDelivery(orderId, restaurantId, deliveryAddress) {
  if (!orderId || !restaurantId || !deliveryAddress) {
    const err = new Error('Missing required delivery fields');
    err.statusCode = 400;
    err.code = 'INVALID_DELIVERY_REQUEST';
    throw err;
  }

  const id = `del_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const delivery = {
    id,
    orderId,
    restaurantId,
    deliveryAddress,
    driverId: null,
    driver: null,
    status: 'WAITING_FOR_RESTAURANT',
    estimatedArrival: null,
    location: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  deliveries.set(id, delivery);
  return delivery;
}

export async function getDeliveryByOrder(orderId) {
  for (const delivery of deliveries.values()) {
    if (delivery.orderId === orderId) {
      return delivery;
    }
  }
  const err = new Error('Delivery not found for this order');
  err.statusCode = 404;
  err.code = 'DELIVERY_NOT_FOUND';
  throw err;
}

export async function updateDeliveryStatus(deliveryId, status) {
  const delivery = deliveries.get(deliveryId);
  if (!delivery) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    err.code = 'DELIVERY_NOT_FOUND';
    throw err;
  }

  delivery.status = status;
  delivery.updatedAt = new Date().toISOString();
  deliveries.set(deliveryId, delivery);

  return delivery;
}

export async function updateDeliveryLocation(deliveryId, lat, lng) {
  const delivery = deliveries.get(deliveryId);
  if (!delivery) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    err.code = 'DELIVERY_NOT_FOUND';
    throw err;
  }

  delivery.location = { lat, lng };
  delivery.updatedAt = new Date().toISOString();
  deliveries.set(deliveryId, delivery);

  return delivery;
}
