import { validate as inputValidate } from 'class-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import Helper from '../../../components/helper';
import {
  LoginByMobileSendCode_validator,
  LoginByMobileVerifyCode_validator,
  LoginByUsernamePassword_validator
} from '../../../components/classValidator/portal/auth';
import { exRedis } from '../../../components/redis/index';
import { findUser } from '../../../services/user';
import { StatusEnum } from '../../../types/custom/enum';
import { AuthHandler, rbac } from '../../../components/auth/index';
import { RoleController } from '../user';

const redis_smsCode = new exRedis('sms_code_', process.env.SMS_CODE_EXPIRE_AFTER);

export const AuthController = {
  loginByUsernamePassword: async (req: Request, res: Response) => {
    try {
      const input = new LoginByUsernamePassword_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      input.username = input.username.toLocaleLowerCase();
      const user = await findUser({ username: input.username });
      if (!user) return response.customError(res, res.t('crud.notFound', { name: res.t('field.user') }), 404);
      if (user.status !== StatusEnum.active) {
        if (user.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
        if (user.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
      }
      if (user.deleted) return response.customError(res, res.t('statusCode.404'), 404);
      const checkPassword = await Helper.Compare(input.password, user.password);
      if (!checkPassword) return response.customError(res, res.t('auth.wrong_username_password'), 400);
      if (user.ip) {
        if (user.ip !== req.ip) return response.customError(res, res.t('auth.wrong_ip'), 403);
      }
      const token = await AuthHandler.UserTokenGenerate(user);
      const auther = await rbac();
      const permissions = await RoleController.formatPermissions(
        await auther.GetEnforcer().getImplicitPermissionsForUser(user._id + ''),
        res
      );
      return response.success(
        res,
        {
          user,
          token,
          permissions,
          roles: await auther.GetEnforcer().getImplicitRolesForUser(user._id + '')
        },
        res.t('crud.success')
      );
    } catch (err) {
      return response.catchError(res, err);
    }
  },

  loginByMobileSendCode: async (req: Request, res: Response) => {
    try {
      const input = new LoginByMobileSendCode_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      if (input.mobile.length === 10) input.mobile = `0${input.mobile}`;
      const user = await findUser({ mobile: input.mobile });
      if (!user) return response.customError(res, res.t('crud.notFound', { name: res.t('field.user') }), 404);
      if (user.status !== StatusEnum.active) {
        if (user.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
        if (user.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
      }
      if (user.deleted) return response.customError(res, res.t('statusCode.404'), 404);
      if (user.ip) {
        if (user.ip !== req.ip) return response.customError(res, res.t('auth.wrong_ip'), 403);
      }
      const oldCode = Number(await redis_smsCode.Get(input.mobile));
      let code: number | string;
      if (oldCode) {
        return response.customError(res, res.t('text.2minLimitSMS'), 429);
      } else {
        code = Math.floor(Math.random() * 1000000);
        code = code.toString().padStart(6, '7');
      }
      console.log('@_@ User verification code is:  ', code, ' @_@');
      await redis_smsCode.Set(input.mobile, code);
      // const phoneNumber = '+98' + input.mobile;
      // sms.sendSms(phoneNumber, SmsTemplate[0], { token: code });
      return response.success(res, {}, res.t('crud.success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  },

  loginByMobileVerifyCode: async (req: Request, res: Response) => {
    try {
      const input = new LoginByMobileVerifyCode_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      if (input.mobile.length === 10) input.mobile = `0${input.mobile}`;
      const user = await findUser({ mobile: input.mobile });
      if (!user) return response.customError(res, res.t('crud.notFound', { name: res.t('field.user') }), 404);
      if (user.status !== StatusEnum.active) {
        if (user.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
        if (user.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
      }
      if (user.deleted) return response.customError(res, res.t('statusCode.404'), 404);
      if (user.ip) {
        if (user.ip !== req.ip) return response.customError(res, res.t('auth.wrong_ip'), 403);
      }
      const code = Number(await redis_smsCode.Get(input.mobile));
      if (!code || input.code !== code) return response.customError(res, res.t('auth.wrongCode'), 403);
      const token = await AuthHandler.UserTokenGenerate(user);
      const auther = await rbac();
      const permissions = await RoleController.formatPermissions(
        await auther.GetEnforcer().getImplicitPermissionsForUser(user._id + ''),
        res
      );
      return response.success(
        res,
        {
          user,
          token,
          permissions,
          roles: await auther.GetEnforcer().getImplicitRolesForUser(user._id + '')
        },
        res.t('crud.success')
      );
    } catch (err) {
      return response.catchError(res, err);
    }
  }
};
