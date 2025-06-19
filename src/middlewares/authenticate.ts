import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { compareRedisKey } from '@/configs/redis.config';
import { AppError } from '@/utils/AppError';
import { type IUserTokenPayload } from '@/types/user';
import responses from '@/constants/responses.json';
import { getEnv } from '@/configs/env.config';

type DecodedToken = IUserTokenPayload;

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export const authenticateAccessToken = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      throw new AppError('Token is not provided', 401);
    }

    const secretKey = getEnv("JWT_SECRET");
    if (!secretKey) {
      throw new AppError('JWT secret key is not defined', 500);
    }

    try {
      const decoded = jwt.verify(accessToken, secretKey) as DecodedToken;

      if (!decoded?.sub) {
        const { message, code } = responses.TOKEN.INVALID_TOKEN;
        throw new AppError(message, code);
      }

      const isAvailableInRedis = await compareRedisKey(decoded.sub, accessToken);
      if (!isAvailableInRedis) {
        const { message, code } = responses.REDIS.VALIDATION_FAILED;
        throw new AppError(message, code);
      }

      req.user = decoded;
      next();
    } catch (err: any) {
      throw AppError.fromJwtError(err);
    }
  }
);
