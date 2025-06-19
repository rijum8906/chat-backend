// middleware/validate.ts
import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof Error && 'errors' in err) {
      return next(err);
    }
    return next(err);
  }
};

export default validate;
