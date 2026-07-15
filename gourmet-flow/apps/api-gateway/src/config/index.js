import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:4002',
  restaurantServiceUrl: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:4003',
  menuServiceUrl: process.env.MENU_SERVICE_URL || 'http://localhost:4004',
  cartServiceUrl: process.env.CART_SERVICE_URL || 'http://localhost:4005',
  orderServiceUrl: process.env.ORDER_SERVICE_URL || 'http://localhost:4006',
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL || 'http://localhost:4007',
  deliveryServiceUrl: process.env.DELIVERY_SERVICE_URL || 'http://localhost:4008',
};

export default config;
