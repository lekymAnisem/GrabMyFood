import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

export default {
  port: parseInt(process.env.PORT, 10) || 4006,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL || 'http://localhost:4007',
  deliveryServiceUrl: process.env.DELIVERY_SERVICE_URL || 'http://localhost:4008',
  cartServiceUrl: process.env.CART_SERVICE_URL || 'http://localhost:4005',
};
