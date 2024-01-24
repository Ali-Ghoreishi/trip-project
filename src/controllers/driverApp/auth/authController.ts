import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import Helper from '../../../components/helper';
import {
  LoginByMobileSendCode_validator,
  LoginByMobileVerifyCode_validator,
  LoginByUsernamePassword_validator
} from '../../../components/classValidator/driver/auth';
import { exRedis } from '../../../components/redis/index';
import { StatusEnum } from '../../../types/custom/enum';
import { AuthHandler, rbac } from '../../../components/auth/index';
import { Register_validator } from '../../../components/classValidator/driver/auth';
import { createDriver, findDriver } from '../../../services/driver';
import Driver, { IDriver, IDriverInput } from '../../../db/models/Driver';

const redis_smsCode = new exRedis('sms_code_', process.env.SMS_CODE_EXPIRE_AFTER);

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const input = new Register_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      input.username = input.username.toLocaleLowerCase();
      if (input.mobile.length === 10) input.mobile = `0${input.mobile}`;
      const checkUsername = await findDriver({ username: input.username });
      if (checkUsername)
        return response.customError(res, res.t('crud.already_exist', { name: res.t('field.username') }), 409);
      const checkEmail = await findDriver({ email: input.email });
      if (checkEmail)
        return response.customError(res, res.t('crud.already_exist', { name: res.t('field.email') }), 409);
      const checkMobile = await findDriver({ mobile: input.mobile });
      if (checkMobile)
        return response.customError(res, res.t('crud.already_exist', { name: res.t('field.mobile') }), 409);

      const createData: IDriverInput = {
        ...input,
        status: StatusEnum.deactive
      };
      const driver = await createDriver(createData);
      return response.success(res, { driver }, res.t('crud.create'));
    } catch (err) {
      return response.catchError(res, err);
    }
  },

  loginByUsernamePassword: async (req: Request, res: Response) => {
    try {
      const input = new LoginByUsernamePassword_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      input.username = input.username.toLocaleLowerCase();
      const driver = await findDriver({ username: input.username });
      if (!driver) return response.customError(res, res.t('crud.notFound', { name: res.t('field.driver') }), 404);
      if (driver.status !== StatusEnum.active) {
        if (driver.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
        if (driver.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
      }
      if (driver.deleted) return response.customError(res, res.t('statusCode.404'), 404);
      const checkPassword = await Helper.Compare(input.password, driver.password);
      if (!checkPassword) return response.customError(res, res.t('auth.wrong_username_password'), 400);
      if (driver.ip) {
        if (driver.ip !== req.ip) return response.customError(res, res.t('auth.wrong_ip'), 403);
      }
      const token = await AuthHandler.DriverTokenGenerate(driver);

      return response.success(
        res,
        {
          driver,
          token
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
      const driver = await findDriver({ mobile: input.mobile });
      if (!driver) return response.customError(res, res.t('crud.notFound', { name: res.t('field.driver') }), 404);
      if (driver.status !== StatusEnum.active) {
        if (driver.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
        if (driver.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
      }
      if (driver.deleted) return response.customError(res, res.t('statusCode.404'), 404);
      if (driver.ip) {
        if (driver.ip !== req.ip) return response.customError(res, res.t('auth.wrong_ip'), 403);
      }
      const oldCode = Number(await redis_smsCode.Get(input.mobile));
      let code: number | string;
      if (oldCode) {
        return response.customError(res, res.t('text.2minLimitSMS'), 429);
      } else {
        code = Math.floor(Math.random() * 1000000);
        code = code.toString().padStart(6, '7');
      }
      console.log('@_@ driver verification code is:  ', code, ' @_@');
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
      const driver = await findDriver({ mobile: input.mobile });
      if (!driver) return response.customError(res, res.t('crud.notFound', { name: res.t('field.driver') }), 404);
      if (driver.status !== StatusEnum.active) {
        if (driver.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
        if (driver.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
      }
      if (driver.deleted) return response.customError(res, res.t('statusCode.404'), 404);
      if (driver.ip) {
        if (driver.ip !== req.ip) return response.customError(res, res.t('auth.wrong_ip'), 403);
      }
      const code = Number(await redis_smsCode.Get(input.mobile));
      if (!code || input.code !== code) return response.customError(res, res.t('auth.wrongCode'), 403);
      const token = await AuthHandler.DriverTokenGenerate(driver);
      return response.success(
        res,
        {
          driver,
          token
        },
        res.t('crud.success')
      );
    } catch (err) {
      return response.catchError(res, err);
    }
  }
};
