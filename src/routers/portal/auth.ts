import express, { Application, Request, Response, NextFunction } from 'express';

import { AuthController } from '../../controllers/portal/auth/authController';
import limiter from '../../middlewares/rateLimit';

const router = express.Router();

router.post('/login/username-password', limiter, AuthController.loginByUsernamePassword);
router.post('/login/mobile-send-code', limiter, AuthController.loginByMobileSendCode);
router.post('/login/mobile-verify-code', limiter, AuthController.loginByMobileVerifyCode);

export default router;
