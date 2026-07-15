import app from './app.js';

const PORT = process.env.PORT || 4008;

app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});
