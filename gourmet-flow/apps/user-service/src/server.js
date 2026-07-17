import app from './app.js';

const PORT = process.env.PORT || 4002;

const server = app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[user-service] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[user-service] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
