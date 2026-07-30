import client from 'prom-client';

const serviceName = process.env.SERVICE_NAME || 'restaurant-service';

client.collectDefaultMetrics({
  labels: { service: serviceName },
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['service', 'method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

function routeLabel(req) {
  return req.route?.path || req.baseUrl || req.path || 'unknown';
}

export function setupMetrics(app) {
  app.get('/metrics', async (_req, res, next) => {
    try {
      res.set('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
    } catch (error) {
      next(error);
    }
  });

  app.use((req, res, next) => {
    if (req.path === '/metrics') {
      next();
      return;
    }

    const endTimer = httpRequestDuration.startTimer();

    res.on('finish', () => {
      endTimer({
        service: serviceName,
        method: req.method,
        route: routeLabel(req),
        status_code: String(res.statusCode),
      });
    });

    next();
  });
}
