import app from './app.js';
import config from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`[order-service] running on port ${config.port} (${config.nodeEnv})`);
});

process.on('SIGTERM', () => {
  console.log('[order-service] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[order-service] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
