import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import requestId from './middleware/requestId.js';
import logger from './middleware/logger.js';
import setupProxyRoutes from './routes/proxyRoutes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use(requestId);
app.use(logger);

setupProxyRoutes(app);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, _next) => {
  console.error(JSON.stringify({
    type: 'unhandled-error',
    requestId: req.id,
    error: err.message,
    stack: err.stack,
  }));
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

export default app;
