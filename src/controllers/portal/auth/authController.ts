import { validate as inputValidate } from 'class-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import Helper from '../../../components/helper';
import { loginByUsernamePassword_validator } from '../../../components/classValidator/user';
import { exRedis } from '../../../components/redis/index';
import { findUser } from '../../../services/user';
import { StatusEnum } from '../../../types/custom/enum';

const redis = new exRedis('forget_password_', process.env.FORGET_PASSWORD_EXPIRE_AFTER);
// const redis2 = new exRedis('sms_code_', process.env.SMS_CODE_EXPIRE_AFTER);

export const AuthController = {
  loginByUsernamePassword: async (req: Request, res: Response) => {
    try {
      const input = new loginByUsernamePassword_validator();
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

      //   if (user.ip) {
      //     if (user.ip != req.ip) {
      //       return response.customError(res, res.t('auth.Wrong_IP'), 403);
      //     }
      //   }
      //   const token = await AuthHandler.UserGen(user);
      //   let auther = await rbac();
      //   // if (req.limiter) {
      //   //   req.limiter.delete(req.body.username);
      //   //   req.limiter.delete(req.ip);
      //   // }

      //   const permissions = await RoleController._formatPermissions(
      //     await auther.GetEnforcer().getImplicitPermissionsForUser(user._id + ''),
      //     res.t
      //   );

      //   return response.success(
      //     res,
      //     {
      //       user,
      //       token,
      //       permissions,
      //       roles: await auther.GetEnforcer().getImplicitRolesForUser(user._id + '')
      //     },
      //     res.t('CRUD.Success')
      //   );
      return res.send('ok');
    } catch (err) {
      console.log(err);
      return response.customError(res, res.t('Server.Internall'), 500, '', err);
    }
  }
};
