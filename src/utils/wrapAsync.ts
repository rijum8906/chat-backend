// utils/wrapAsync.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const wrapAsync =
  <T extends Request = Request, P extends Response = Response>(
    fn: (req: T, res: P, next: NextFunction) => any | Promise<any>
  ): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req as T, res as P, next)).catch(next);
