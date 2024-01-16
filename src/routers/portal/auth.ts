import express, { Application, Request, Response, NextFunction } from 'express';
const router = express.Router();

import { AuthController } from '../../controllers/portal/auth/authController';
import limiter from '../../middlewares/rateLimit';


router.post('/login/username-password', limiter, AuthController.loginByUsernamePassword);
// router.post('/login/send-code', limiter, AuthController.LoginByMobile);
// router.post('/login/verify-code', limiter, AuthController.VerifyLoginByMobile);

export default router;
