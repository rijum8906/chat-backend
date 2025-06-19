import type { Request, Response } from 'express';
import type { IDeviceInfo } from './general';
import type { IUser } from './user';

export interface AppHttpRequest extends Request {
  device: IDeviceInfo;
  user?: {
    id: string;
    token: string;
  }
}

export interface IAuthData {
  user: IUser;
  token:  string;
}

export interface AppHttpResponse<T> extends Response {
  json: (body: {
    status: 'success' | 'fail' | 'error';
    message: string;
    data?: T;
    errors?: Record<string, any>;
  }) => this;
}