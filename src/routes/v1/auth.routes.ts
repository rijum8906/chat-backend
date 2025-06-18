import express from "express";
import { login, register } from "@/controllers/v1/auth.controller";
import validate from "@/middlewares/zodValidate";
import { loginValidator } from "@/validators/auth.validator";
import { wrapAsync } from '@/utils/wrapAsync';
import { AppHTTPRequest } from "@/types/app";

const authRouter = express.Router();
authRouter.post('/login', validate(loginValidator), wrapAsync<AppHTTPRequest>(login));
authRouter.post('/register', wrapAsync<AppHTTPRequest>(register))

export default authRouter;