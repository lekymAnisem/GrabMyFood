import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 4008,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DELIVERY_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gourmet-delivery',
  },
};

export default config;
