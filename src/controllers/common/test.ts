import { Request, Response } from 'express';
import { validate as inputValidate } from 'class-validator';
import bcrypt from 'bcrypt'

import response from '../../components/responseHandler';
import { createUser, findUsers } from '../../services/user';
import { AuthHandler } from '../../components/auth';
import { LoginByMobileSendCode_validator } from '../../components/classValidator/portal/auth';

export const testController = {
  post: async (req: Request, res: Response) => {
    try {
      const input = new LoginByMobileSendCode_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      if (input.mobile.length === 10) input.mobile = `0${input.mobile}`
      
      return response.success(res, { input }, 'ok');
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      // const x = await bcrypt.hash('11111111', 10)
      // console.log(x);
      return response.success(res, {}, 'ok');
    } catch (error) {
      return response.catchError(res, error);
    }
  }
};
