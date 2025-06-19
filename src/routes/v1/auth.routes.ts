import express from 'express';
import { login, register } from '@/controllers/v1/auth.controller';
import validate from '@/middlewares/zodValidate';
import { loginValidator } from '@/validators/auth.validator';
import { wrapAsync } from '@/utils/wrapAsync';
import type { AppHttpRequest, AppHttpResponse } from '@/types/app';

const authRouter = express.Router();
authRouter.post('/login', validate(loginValidator), wrapAsync<AppHttpRequest>(login));
authRouter.post('/register', wrapAsync<AppHttpRequest, AppHttpResponse>(register));

export default authRouter;
