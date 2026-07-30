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
  {
    path: '/api/devops-ai',
    target: config.devopsAiAgentUrl,
    rewrite: (req) => req.originalUrl.replace(/^\/api\/devops-ai/, '/api/v1'),
  },
];

function forwardRequest(req, res, target, rewrite) {
  const targetUrl = new URL(target);
  const body = req.body ? JSON.stringify(req.body) : null;
  const targetPath = rewrite ? rewrite(req) : req.originalUrl.replace(/^\/api/, '');

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
  routes.forEach(({ path, target, rewrite }) => {
    app.use(path, (req, res) => forwardRequest(req, res, target, rewrite));
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/ready', (req, res) => {
    res.json({ status: 'ready' });
  });

  app.get('/health/downstream', async (req, res) => {
    const services = await aggregateHealth();
    res.json({ status: 'ok', services });
  });

  app.get('/devops-ai/status', (_req, res) => {
    const agentHealthUrl = new URL('/health', config.devopsAiAgentUrl);
    const request = http.get(agentHealthUrl, { timeout: 5000 }, (agentRes) => {
      let responseBody = '';

      agentRes.on('data', (chunk) => {
        responseBody += chunk;
      });

      agentRes.on('end', () => {
        let agentResponse = responseBody;

        try {
          agentResponse = responseBody ? JSON.parse(responseBody) : null;
        } catch {
          agentResponse = responseBody || null;
        }

        res.status(agentRes.statusCode === 200 ? 200 : 502).json({
          status: agentRes.statusCode === 200 ? 'connected' : 'unhealthy',
          url: config.devopsAiAgentUrl,
          agentStatusCode: agentRes.statusCode,
          agentResponse,
        });
      });
    });

    request.on('error', (error) => {
      res.status(502).json({
        status: 'unreachable',
        url: config.devopsAiAgentUrl,
        error: error.message,
      });
    });

    request.on('timeout', () => {
      request.destroy();
    });
  });
}
