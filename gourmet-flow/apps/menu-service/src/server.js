import app from './app.js';

const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
  console.log(`Menu service running on port ${PORT}`);
});
