import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 4004,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.MENU_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gourmet-menu',
  },
};

export default config;
