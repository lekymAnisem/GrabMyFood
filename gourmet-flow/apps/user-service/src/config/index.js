import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 4002,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  },
  database: {
    url: process.env.USER_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gourmet-user',
  },
};

export default config;
