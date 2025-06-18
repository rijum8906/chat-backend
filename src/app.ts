import express from 'express';
import type { Application, Response, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {generateDeviceInfo} from '@/middlewares/deviceInfo';

dotenv.config(); // Load environment variables

const app: Application = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(generateDeviceInfo());

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'API is healthy!' });
});

export { app };
