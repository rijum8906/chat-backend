import type { RequestHandler, Request, Response, NextFunction } from 'express';
import { generateDeviceId, getIpFromReq, getUserAgentFromReq } from '@/utils/middleware.utils';
import type { AppHttpRequest } from '@/types/app';

export const generateDeviceInfo = (): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const appReq = req as AppHttpRequest;
    appReq.device = {
      ip: getIpFromReq(appReq),
      id: generateDeviceId(appReq),
      userAgent: getUserAgentFromReq(appReq)
    };
    next();
  };
};
