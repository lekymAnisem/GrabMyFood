import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
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
app.use(cors());
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    error: { code: 'RATE_LIMIT_EXCEEDED', details: [] },
  },
});
app.use(limiter);

app.use((req, _res, next) => {
  req.id = uuidv4();
  next();
});

app.use((req, _res, next) => {
  logger.info({ requestId: req.id, method: req.method, url: req.url }, 'incoming request');
  next();
});

app.use(userRoutes);

app.use(errorHandler);

export default app;
