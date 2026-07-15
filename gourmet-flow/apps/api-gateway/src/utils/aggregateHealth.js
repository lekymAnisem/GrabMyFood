import axios from 'axios';
import config from '../config/index.js';

const SERVICE_HEALTH_URLS = [
  { name: 'auth', url: `${config.authServiceUrl}/health` },
  { name: 'user', url: `${config.userServiceUrl}/health` },
  { name: 'restaurant', url: `${config.restaurantServiceUrl}/health` },
  { name: 'menu', url: `${config.menuServiceUrl}/health` },
  { name: 'cart', url: `${config.cartServiceUrl}/health` },
  { name: 'order', url: `${config.orderServiceUrl}/health` },
  { name: 'payment', url: `${config.paymentServiceUrl}/health` },
  { name: 'delivery', url: `${config.deliveryServiceUrl}/health` },
];

export default async function aggregateHealth() {
  const results = await Promise.allSettled(
    SERVICE_HEALTH_URLS.map(({ name, url }) =>
      axios.get(url, { timeout: 5000 })
        .then(res => ({ status: 'healthy', response: res.data }))
        .catch(() => ({ status: 'unhealthy', response: null }))
    )
  );

  const services = {};

  SERVICE_HEALTH_URLS.forEach(({ name }, i) => {
    services[name] = results[i].value;
  });

  return services;
}
