import app from './app.js';
import config from './config/index.js';

const PORT = config.port || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
