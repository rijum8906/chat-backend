import { Request } from "express";
import { IDeviceInfo } from "./general";

export interface AppHTTPRequest extends Request {
  device: IDeviceInfo;
}