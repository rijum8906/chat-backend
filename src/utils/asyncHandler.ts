import type { NextFunction, RequestHandler } from 'express';
import type { AppHttpRequest, AppHttpResponse } from '@/types/app';

export function typedAsyncHandler<T = undefined>(
  handler: (req: AppHttpRequest, res: AppHttpResponse<T>, next: NextFunction) => any
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req as AppHttpRequest, res as AppHttpResponse<T>, next)).catch(next);
  };
}
