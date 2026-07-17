import app from './app.js';

const PORT = process.env.PORT || 4003;

const server = app.listen(PORT, () => {
  console.log(`Restaurant service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[restaurant-service] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[restaurant-service] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
