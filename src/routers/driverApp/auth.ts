import express, { Application, Request, Response, NextFunction } from 'express';

import { AuthController } from '../../controllers/driverApp/auth/authController';
import limiter from '../../middlewares/rateLimit';

const router = express.Router();

/**
 * @swagger
 * components:
 *   responses:
 *     404:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *       description: The specified resource was not found
 *     403:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *       description: Forbidden
 *     401:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *       description: Unauthorized
 *     500:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *       description: Internal server error
 *     default:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *       description: Unexpected error
 *   schemas:
 *     Error:
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *       required:
 *         - code
 *         - message
 *       type: object
 *   securitySchemes:
 *     bearerAuth:
 *       bearerFormat: JWT
 *       scheme: bearer
 *       type: http
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterSendCode:
 *       type: object
 *       required:
 *         - mobile
 *       properties:
 *         mobile:
 *           type: string
 *           default: 09134444444
 *     RegisterSendCodeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data: 
 *           type: object
 * 
 *     RegisterVerifyCode:
 *       type: object
 *       properties:
 *         code:
 *           type: number
 *         mobile:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         fullname:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         photo_url:
 *           type: string
 *         description:
 *           type: string
 *     RegisterVerifyCodeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data: 
 *           type: object
 *           properties:
 *             driver:
 *               type: object
 * 
 *     LoginByUsernamePassword:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           default: aligh99
 *         password:
 *           type: string
 *           default: password123456
 *     LoginByUsernamePasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data: 
 *           type: object
 *           properties:    
 *             driver:
 *               type: object
 *             token:
 *               type: string
 *             sessionid:
 *                type: string
 * 
 *     LoginByMobileSendCode:
 *       type: object
 *       required:
 *         - mobile
 *       properties:
 *         mobile:
 *           type: string
 *           default: 09134444444
 *     LoginByMobileSendCodeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data: 
 *           type: object
 * 
 *     LoginByMobileVerifyCode:
 *       type: object
 *       required:
 *         - mobile
 *         - code
 *       properties:
 *         mobile:
 *           type: string
 *           default: 09134444444
 *         code:
 *           type: number
 *           default: 24534223
 *     LoginByMobileVerifyCodeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data: 
 *           type: object
 *           properties:    
 *             driver:
 *               type: object
 *             token:
 *               type: string
 *             sessionid:
 *                type: string
 * 
 * /api/driver-app/auth/register/send-code:
 *   post:
 *     tags:
 *       - DriverApp-Auth
 *     summary: Register DriverApp - send code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterSendCode'
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterSendCodeResponse'
 *         description: Successful login
 *       "400":
 *         description: Bad Request
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "403":
 *         $ref: '#/components/responses/403'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 *       "default":
 *          $ref: '#/components/responses/default'
 * /api/driver-app/auth/register/verify-code:
 *   post:
 *     tags:
 *       - DriverApp-Auth
 *     summary: Register DriverApp - verify code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterVerifyCode'
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterVerifyCodeResponse'
 *         description: Successful login
 *       "400":
 *         description: Bad Request
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "403":
 *         $ref: '#/components/responses/403'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 *       "default":
 *          $ref: '#/components/responses/default'
 * /api/driver-app/auth/login/username-password:
 *   post:
 *     tags:
 *       - DriverApp-Auth
 *     summary: Login DriverApp by username-password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginByUsernamePassword'
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginByUsernamePasswordResponse'
 *         description: Successful login
 *       "400":
 *         description: Bad Request
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "403":
 *         $ref: '#/components/responses/403'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 *       "default":
 *          $ref: '#/components/responses/default'
 * /api/driver-app/auth/login/mobile-send-code:
 *   post:
 *     tags:
 *       - DriverApp-Auth
 *     summary: Login DriverApp by mobile - send code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginByMobileSendCode'
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginByMobileSendCodeResponse'
 *         description: Successful login
 *       "400":
 *         description: Bad Request
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "403":
 *         $ref: '#/components/responses/403'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 *       "default":
 *          $ref: '#/components/responses/default'
 * /api/driver-app/auth/login/mobile-verify-code:
 *   post:
 *     tags:
 *       - DriverApp-Auth
 *     summary: Login DriverApp by mobile - verify code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginByMobileVerifyCode'
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginByMobileVerifyCodeResponse'
 *         description: Successful login
 *       "400":
 *         description: Bad Request
 *       "401":
 *         $ref: '#/components/responses/401'
 *       "403":
 *         $ref: '#/components/responses/403'
 *       "404":
 *         $ref: '#/components/responses/404'
 *       "500":
 *         $ref: '#/components/responses/500'
 *       "default":
 *          $ref: '#/components/responses/default'
 */

router.post('/register/send-code', limiter, AuthController.registerSendCode);
router.post('/register/verify-code', limiter, AuthController.registerVerifyCode);
router.post('/login/username-password', limiter, AuthController.loginByUsernamePassword);
router.post('/login/mobile-send-code', limiter, AuthController.loginByMobileSendCode);
router.post('/login/mobile-verify-code', limiter, AuthController.loginByMobileVerifyCode);

export default router;
