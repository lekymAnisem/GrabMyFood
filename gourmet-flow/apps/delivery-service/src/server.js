import app from './app.js';

const PORT = process.env.PORT || 4008;

const server = app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[delivery-service] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[delivery-service] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
