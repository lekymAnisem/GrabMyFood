import app from './app.js';
import config from './config/index.js';

const PORT = config.port || 4000;

const server = app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[api-gateway] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[api-gateway] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
