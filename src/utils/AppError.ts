// utils/AppError.ts
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import jwt from 'jsonwebtoken';
import responses from '@/constants/responses.json';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: Record<string, any>;

  constructor(
    message: string,
    statusCode = 500,
    options?: {
      errors?: Record<string, any>;
      isOperational?: boolean;
    }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.errors = options?.errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static fromZodError(error: ZodError, statusCode = 400) {
    return new AppError('Validation failed', statusCode, {
      errors: error.flatten().fieldErrors
    });
  }

  static fromMongoError(error: any) {
    if (error.code === 11000) {
      const { message, code } = responses.DATABASE.DUPLICATE_KEY;
      return new AppError(message, code, {
        errors: error.keyValue
      });
    } else if (error instanceof MongooseError.ValidationError) {
      const { message, code } = responses.DATABASE.VALIDATION_FAILED;
      const formattedErrors: Record<string, string> = {};
      for (const key in error.errors) {
        formattedErrors[key] = error.errors[key].message;
      }

      return new AppError(message, code, {
        errors: formattedErrors
      });
    }

    const { message, code } = responses.DATABASE.DB_ERROR;
    return new AppError(message, code, {
      errors: { message: error.message }
    });
  }

  static fromJwtError(error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      const { code, message } = responses.TOKEN.TOKEN_EXPIRED;
      return new AppError(message, code);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      const { code, message } = responses.TOKEN.INVALID_TOKEN;
      return new AppError(message, code);
    }

    return new AppError('JWT error', 401, {
      errors: { message: error.message }
    });
  }
}
