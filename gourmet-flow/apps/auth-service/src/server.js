import app from './app.js';

const PORT = process.env.PORT || 4001;

const server = app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[auth-service] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[auth-service] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
