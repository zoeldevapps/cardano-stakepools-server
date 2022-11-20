import dotenv from 'dotenv';
dotenv.config();

export const options = {
  port: Number(process.env.PORT || 0),
  cors: process.env.CORS || '*',
  logLevel: process.env.LOG_LEVEL,
  isDevelopment: process.env.NODE_ENV !== 'production',
  db: process.env.DB_SQLITE || './db.sqlite',
  ogmios: {
    host: process.env.OGMIOS_HOST,
    port: Number(process.env.OGMIOS_PORT || 1337),
  },
};
