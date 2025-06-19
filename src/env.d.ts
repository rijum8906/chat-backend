// src/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    NODE_ENV: 'production' | 'development';
    
    // Clients
    CLIENT_URLS: string;

    // Database
    MONGO_URI: string;

    // Redis
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    REDIS_PORT: number;
    REDIS_URL: string;

    // Jwt
    JWT_SECRET: string;
    JWT_EXPIRES_IN: number;
    JWT_REFRESH_EXPIRES_IN: number;
    JWT_REFRESH_SECRET: string;

    // Model
    LOGIN_HISTORY_EXPIRES_IN: number;
  }
}
