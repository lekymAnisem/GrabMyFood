import app from './app.js';

const PORT = process.env.PORT || 4007;

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});
