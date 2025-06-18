import { Response } from 'express';
import type { AppHTTPRequest } from '@/types/app';
import { AppError } from "@/utils/AppError";
import AuthModel from '@/models/auth.model';
import type { LoginPayload } from '@/validators/auth.validator';
import responses from '@/constants/responses.json';
import { loginService, registerService } from '@/services/v1/auth.service';
import { typedAsyncHandler } from '@/utils/asyncHandler';


export const login = typedAsyncHandler<AppHTTPRequest>(async (req: AppHTTPRequest, res: Response) => {
  var payload: LoginPayload = { password: req.body.password };
  if(req.body.username) payload = { ...payload, ...{ username : req.body.username }};
  else if(req.body.email) payload = { ...payload, ...{email : req.body.email }};
  else throw new AppError('Invalid Data', 400);
  
  const searchQuery = { ...{username: payload?.username , email: payload?.email} };
  const fetchedUser =  await AuthModel.findOne({ searchQuery })
  
  // Check if the user exists
  if(!fetchedUser) {
    const { message, code } = responses.VALIDATION.INVALID_CREDENTIALS;
    throw new AppError(message, code);
  }
  
  // Check if the password matches
  if(!fetchedUser.comparePassword(payload.password)) {
    const { message, code } = responses.VALIDATION.INVALID_CREDENTIALS;
    throw new AppError(message, code);
  }
  
  const { user, accessToken, refreshToken } = await loginService(fetchedUser, req.device);
  
  const { code, message } = responses.AUTH.LOGIN_SUCCESS;
    // Set refresh token as HTTP-only cookie for secure session management
  res.cookie("token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(code).json({
    status: "success",
    message,
    data: {
      user,
      token: accessToken
    }
  });
});

export const register = typedAsyncHandler<AppHTTPRequest>(async (req: AppHTTPRequest, res: Response) => {
  
  const { username, email } = req.body;
  const fetchedUser = await AuthModel.findOne({
    $or: [
      {
        username
      },
      {
        email
      }
    ]
  })
  
    // Check if the user exists
  if(fetchedUser) {
    const { message, code } = username === fetchedUser.username ? responses.USER.USERNAME_ALREADY_IN_USE : responses.USER.EMAIL_ALREADY_IN_USE;
    throw new AppError(message, code);
  }
  
  const { user, accessToken, refreshToken } = await registerService(req.body , req.device);
  
  const { code, message } = responses.AUTH.REGISTER_SUCCESS;
    // Set refresh token as HTTP-only cookie for secure session management
  res.cookie("token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(code).json({
    status: "success",
    message,
    data: {
      user,
      token: accessToken
    }
  });
});