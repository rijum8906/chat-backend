import express from 'express';
import type { Application } from 'express';
import type { AppHttpRequest, AppHttpResponse } from './types/app';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { generateDeviceInfo } from '@/middlewares/deviceInfo';
import { configEnv, getEnv } from './configs/env.config';
import { wrapAsync } from './utils/wrapAsync';

dotenv.config(); // Load environment variables
configEnv(); // Config environment variables 

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: getEnv("CLIENT_URLS") || "*",
    credentials: getEnv("CLIENT_URLS") ? true : false,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generateDeviceInfo());

// Health check route
app.get('/api/health', wrapAsync<AppHttpRequest, AppHttpResponse>((_req, res) => {
  return res.status(200).json({
    status: "success",
    message: "App api health is good."
  })
}));

export { app };
