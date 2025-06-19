import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';

export const globalErrorHandler = (): ErrorRequestHandler => {
  return (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        errors: err.errors || null
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  };
};
