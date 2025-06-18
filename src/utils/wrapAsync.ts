// utils/wrapAsync.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const wrapAsync =
  <T extends Request = Request>(
    fn: (req: T, res: Response, next: NextFunction) => any | Promise<any>
  ): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req as T, res, next)).catch(next);