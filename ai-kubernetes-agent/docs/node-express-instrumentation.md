# Node.js Express Metrics

Use `prom-client` in each service when application metrics are missing.

```ts
import client from "prom-client";

const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route", "status"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

registry.registerMetric(httpDuration);

app.use((req, res, next) => {
  const end = httpDuration.startTimer();
  res.on("finish", () => end({ method: req.method, route: req.route?.path ?? "unknown", status: String(res.statusCode) }));
  next();
});

app.get("/metrics", async (_req, res) => {
  res.setHeader("content-type", registry.contentType);
  res.send(await registry.metrics());
});
```

Never use user IDs, email addresses, JWTs, passwords, session IDs, complete URLs with identifiers, credit card information, or database credentials as labels.
