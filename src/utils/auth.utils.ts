import { IUserDBInfo } from '@/types/user';
import { IUser } from '@/types/user';
import jwt, { type Secret } from 'jsonwebtoken';
import { AppError } from './AppError';
import { getEnv, getEnvNumber } from '@/configs/env.config';

export interface IFormattedUser {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export const formatUserData = (user: IUserDBInfo): IFormattedUser => {
  const accessTokenPayload = {
    sub: user._id,
    roles: user.roles
  };

  const refreshTokenPayload = {
    sub: user._id.toString()
  };

  return {
    user: {
      username: user.username,
      email: user.email,
      sub: user._id.toString(),
      profile: {
        displayName: user.profile.displayName,
        avatarURL: user.profile.avatarURL
      }
    },
    accessToken: generateToken({ payload: accessTokenPayload }),
    refreshToken: generateToken({
      payload: refreshTokenPayload,
      expiresIn: getEnvNumber("JWT_REFRESH_EXPIRES_IN"),
      secretKey: getEnv("JWT_REFRESH_SECRET")
    })
  };
};

export const generateToken = ({
  payload,
  secretKey,
  expiresIn
}: {
  payload: object;
  secretKey?: Secret;
  expiresIn?: number;
}) => {
  const secret = secretKey || getEnv("JWT_SECRET");
  if (!secret) throw new AppError('JWT_SECRET is not defined', 500);

  return jwt.sign(payload, secret, {
    expiresIn: expiresIn || getEnvNumber("JWTEXPIRES_IN"),
    algorithm: 'HS256'
  });
};
