import { validate as inputValidate } from 'class-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import Helper from '../../../components/helper';
import {
  LoginByMobileSendCode_validator,
  LoginByUsernamePassword_validator
} from '../../../components/classValidator/portal/user';
import { exRedis } from '../../../components/redis/index';
import { findUser } from '../../../services/user';
import { StatusEnum } from '../../../types/custom/enum';
import { AuthHandler, rbac } from '../../../components/auth/index';
import { RoleController } from '../user';

const redis = new exRedis('forget_password_', process.env.FORGET_PASSWORD_EXPIRE_AFTER);
// const redis2 = new exRedis('sms_code_', process.env.SMS_CODE_EXPIRE_AFTER);

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
        res.t('CRUD.Success')
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
      // const phoneNumber = '+98' + value.mobile;
      // // convert 9*** to 09***
      // // value.mobile = 0 + '' + value.mobile;
      // const user = await findUser({ mobile: value.mobile, deleted: 'no' });
      // if (!user) {
      //   return response.validation(res, res.t('CRUD.Not_Found', { name: res.t('joi.field.user') }));
      // }
      // if (user.status != UserStatus[0]) {
      //   return response.customError(res, res.t('auth.deactive'), 403);
      // }
      // if (user.deleted == 'yes') {
      //   return response.customError(res, res.t(UserStatus[2], { scope: 'auth' }), 403);
      // }
      // if (user.ip) {
      //   if (user.ip != req.ip) {
      //     return response.customError(res, res.t('auth.Wrong_IP'), 403);
      //   }
      // }
      // const oldCode = Number(await redis2.Get(value.mobile));
      // let code: number | string;
      // if (oldCode) {
      //   // code = oldCode;
      //   return response.customError(res, res.t('auth.2_Min_Limit_SMS'), 429);
      // } else {
      //   code = Math.floor(Math.random() * 1000000);
      //   code = code.toString().padStart(6, '7');
      // }
      // console.log('*** User verification code is:  ', code);
      // await redis2.Set(value.mobile, code);
      // sms.sendSms(phoneNumber, SmsTemplate[0], { token: code });
      // return response.success(res, {}, res.t('CRUD.Success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  }

  // loginByMobileVerifyCode: async (req: Request, res: Response) => {
  //   try {
  //     const schema = joi.object().keys({
  //       mobile: joi
  //         .string()
  //         .trim()
  //         .min(10)
  //         .max(11)
  //         .pattern(/^[0-9]+$/)
  //         //@ts-ignore
  //         .custom(Helper.JOI('mobile'))
  //         .required(),
  //       code: joi.number().required()
  //     });
  //     const { error, value } = schema.validate(req.body, { abortEarly: true });
  //     if (error) {
  //       return response.validation(res, error);
  //     }
  //     Helper.NullObj(value);

  //     // convert 9*** to 09***
  //     // value.mobile = 0 + '' + value.mobile;

  //     const user = await findUser({ mobile: value.mobile, deleted: 'no' });
  //     if (!user) {
  //       return response.validation(res, res.t('CRUD.Not_Found', { name: res.t('joi.field.user') }));
  //     }
  //     if (user.status != UserStatus[0]) {
  //       return response.customError(res, res.t('auth.deactive'), 403);
  //     }
  //     if (user.deleted == 'yes') {
  //       return response.customError(res, res.t(UserStatus[2], { scope: 'auth' }), 403);
  //     }
  //     if (user.ip) {
  //       if (user.ip != req.ip) {
  //         return response.customError(res, res.t('auth.Wrong_IP'), 403);
  //       }
  //     }
  //     const code = Number(await redis2.Get(value.mobile));
  //     // if (!code || value.code !== code) {
  //     //   return response.customError(res, res.t('auth.Wrong_Code'), 403);
  //     // }
  //     if (value.code != 4444) {
  //       //! Remove me - development and test
  //       if (!code || value.code !== code) {
  //         return response.customError(res, res.t('auth.Wrong_Code'), 403);
  //       }
  //     }
  //     const token = await AuthHandler.UserGen(user);
  //     let auther = await rbac();
  //     const permissions = await RoleController._formatPermissions(
  //       await auther.GetEnforcer().getImplicitPermissionsForUser(user._id + ''),
  //       res.t
  //     );

  //     return response.success(
  //       res,
  //       {
  //         user,
  //         token,
  //         permissions,
  //         roles: await auther.GetEnforcer().getImplicitRolesForUser(user._id + '')
  //       },
  //       res.t('CRUD.Success')
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     return response.customError(res, res.t('Server.Internall'), 500, err);
  //   }
  // }
};
