import type { RequestHandler, Request, Response, NextFunction} from "express";
import { generateDeviceId, getIpFromReq, getUserAgentFromReq } from "@/utils/middleware.utils";
import type { AppHTTPRequest } from "@/types/app";


export const generateDeviceInfo = (): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const appReq = req as AppHTTPRequest;
    appReq.device = {
    ip: getIpFromReq(appReq),
    id: generateDeviceId(appReq),
    userAgent: getUserAgentFromReq(appReq)
  }
  next();
  }
}