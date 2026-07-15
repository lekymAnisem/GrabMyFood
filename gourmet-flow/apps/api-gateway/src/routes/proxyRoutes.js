import http from 'http';
import config from '../config/index.js';
import aggregateHealth from '../utils/aggregateHealth.js';

const routes = [
  { path: '/api/auth', target: config.authServiceUrl },
  { path: '/api/users', target: config.userServiceUrl },
  { path: '/api/restaurants', target: config.restaurantServiceUrl },
  { path: '/api/menu', target: config.menuServiceUrl },
  { path: '/api/cart', target: config.cartServiceUrl },
  { path: '/api/orders', target: config.orderServiceUrl },
  { path: '/api/payments', target: config.paymentServiceUrl },
  { path: '/api/delivery', target: config.deliveryServiceUrl },
];

function forwardRequest(req, res, target) {
  const targetUrl = new URL(target);
  const body = req.body ? JSON.stringify(req.body) : null;
  const targetPath = req.originalUrl.replace(/^\/api/, '');

  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: targetPath || '/',
    method: req.method,
    headers: {
      ...req.headers,
      host: targetUrl.host,
      connection: 'close',
    },
    timeout: 30000,
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.headers['Content-Length'] = Buffer.byteLength(body);
  }

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error(JSON.stringify({
      type: 'proxy-error',
      requestId: req.id,
      error: err.message,
      target,
    }));
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: `Failed to proxy request to ${target}`,
      });
    }
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!res.headersSent) {
      res.status(504).json({
        error: 'Gateway Timeout',
        message: `Request timed out proxying to ${target}`,
      });
    }
  });

  if (body) {
    proxyReq.write(body);
  }

  proxyReq.end();
}

export default function setupProxyRoutes(app) {
  routes.forEach(({ path, target }) => {
    app.use(path, (req, res) => forwardRequest(req, res, target));
  });

  app.get('/health', async (req, res) => {
    const services = await aggregateHealth();
    res.json({ status: 'ok', services });
  });

  app.get('/ready', async (req, res) => {
    const services = await aggregateHealth();
    const allHealthy = Object.values(services).every(s => s.status === 'healthy');

    if (allHealthy) {
      res.json({ status: 'ready', services });
    } else {
      res.status(503).json({ status: 'not ready', services });
    }
  });
}
