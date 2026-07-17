import app from './app.js';

const PORT = process.env.PORT || 4004;

const server = app.listen(PORT, () => {
  console.log(`Menu service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[menu-service] SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[menu-service] SIGINT received, shutting down');
  server.close(() => process.exit(0));
});
