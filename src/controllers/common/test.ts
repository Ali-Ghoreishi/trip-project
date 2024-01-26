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
      return response.success(res, { }, 'ok');
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      return response.success(res, {}, 'ok');
    } catch (error) {
      return response.catchError(res, error);
    }
  }
};
