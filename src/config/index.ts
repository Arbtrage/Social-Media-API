import { config } from 'dotenv';

config();

const environment = process.env.NODE_ENV || 'development';

export default {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  isProduction: environment === 'production',
};
