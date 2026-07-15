import dotenv from 'dotenv';
dotenv.config();

export default {
  port: parseInt(process.env.PORT, 10) || 4005,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
