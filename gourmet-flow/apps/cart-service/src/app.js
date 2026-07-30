import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import cartRoutes from './routes/cartRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { setupMetrics } from './metrics.js';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

const app = express();

setupMetrics(app);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please try again later.', status: 429 } },
});
app.use(limiter);

app.use((req, _res, next) => {
  req.id = uuidv4();
  next();
});

app.use((req, _res, next) => {
  logger.info({ reqId: req.id, method: req.method, url: req.url }, 'incoming request');
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cart-service' }));
app.get('/ready', (req, res) => res.json({ status: 'ready', service: 'cart-service' }));

app.use('/cart', cartRoutes);

app.use(errorHandler);

export default app;
