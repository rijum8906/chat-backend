import { AppError } from '@/utils/AppError';
import type { IUserAuth } from '@/models/auth.model';
import { LoginHistoryModel } from '@/models/loginHistory.model';
import { ProfileModel } from '@/models/profile.model';
import AuthModel from '@/models/auth.model';
import type { IUserDBInfo } from '@/types/user';
import { RegisterPayload } from '@/validators/auth.validator';
import { formatUserData } from '@/utils/auth.utils';
import { IDeviceInfo } from '@/types/general';
import responses from '@/constants/responses.json';
import { redisClient } from '@/configs/redis.config';
import { getEnv } from '@/configs/env.config';

export const loginService = async (fetchedUser: IUserAuth, deviceInfo: IDeviceInfo) => {
  // Check if user's accound is locked
  if (fetchedUser.isLocked) {
    const { message, code } = responses.AUTH.ACCOUNT_LOCKED;
    throw new AppError(message, code);
  }

  const userFullInfo: IUserDBInfo = await fetchedUser.populate('profileId');

  // Save login info to database
  const newLoginHistory = new LoginHistoryModel(deviceInfo);
  await newLoginHistory.save();

  // Format user
  const { user, accessToken, refreshToken } = formatUserData(userFullInfo);

  // Save login session
  fetchedUser.addSession({
    ipAddress: deviceInfo.ip,
    deviceId: deviceInfo.id,
    userAgent: deviceInfo.userAgent,
    token: refreshToken
  });
  await fetchedUser.save();

  // Saving the access token to redis
  await redisClient.setex(user.sub, accessToken, getEnv("JWT_EXPIRES_IN"));

  return { user, accessToken, refreshToken };
};

export const registerService = async (userPayload: RegisterPayload, deviceInfo: IDeviceInfo) => {
  const newUserProfile = new ProfileModel({
    firstName: userPayload.firstName,
    lastName: userPayload.lastName,
    ipAddress: deviceInfo.ip
  });
  const newUser = new AuthModel({
    email: userPayload.email,
    username: userPayload.username,
    password: userPayload.password,
    profileId: newUserProfile._id
  });

  // Save user to db
  await newUserProfile.save();
  await newUser.save();

  // Save login info to database
  const newLoginHistory = new LoginHistoryModel(deviceInfo);
  await newLoginHistory.save();

  const newUserFullInfo: IUserDBInfo = await newUser.populate('profileId');
  // Format user
  const { user, accessToken, refreshToken } = formatUserData(newUserFullInfo);

  newUser.addSession({
    ipAddress: deviceInfo.ip,
    deviceId: deviceInfo.id,
    userAgent: deviceInfo.userAgent,
    token: refreshToken
  });
  await newUser.save();

  // Saving the access token to redis
  await redisClient.setex(user.sub, accessToken, process.env.JWT_EXPIRES_IN);

  return { user, accessToken, refreshToken };
};


export const logoutService = async (userId: string, value: string) => {
  const user = await AuthModel.findById(userId);

  // Remove session from redis
  await redisClient.del(userId);

  // Remove session from db
  user?.removeSession({
    key: "token",
    value: value
  });

  // Save to db
  user?.save();
  
  return true;
};