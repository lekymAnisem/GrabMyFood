import app from './app.js';

const PORT = process.env.PORT || 4007;

const server = app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[payment-service] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[payment-service] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
