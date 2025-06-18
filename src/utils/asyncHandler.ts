import type { Request, Response, NextFunction, RequestHandler } from 'express';

export function typedAsyncHandler<T extends Request>(
  handler: (req: T, res: Response, next: NextFunction) => any
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req as T, res, next)).catch(next);
  };
}