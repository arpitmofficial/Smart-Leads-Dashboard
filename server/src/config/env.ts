import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the server root regardless of working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NODE_ENV: string;
  CLIENT_URL: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  MONGODB_URI: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/smart-leads'),
  JWT_SECRET: getEnvVar('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  CLIENT_URL: getEnvVar('CLIENT_URL', 'http://localhost:5173'),
};

if (
  env.NODE_ENV === 'production' &&
  env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production'
) {
  throw new Error('JWT_SECRET must be set to a secure value in production');
}
