import joi from 'joi';
import { Request, Response } from 'express';
import * as argon2 from 'argon2';

import response from '../../../components/responseHandler';
import User, { IUser } from '../../../db/models/User';
import { createUser, findUser } from '../../../services/user';

export const UserController = {
  create: async (req: Request, res: Response) => {
    try {
      // let auther = await rbac();
      // let rawRoles = await auther.GetEnforcer().getAllSubjects();
      const schema = joi.object().keys({
        username: joi.string().min(4).max(30).trim().alphanum().required(),
        //@ts-ignore
        password: joi.string(),
        fullname: joi.string().max(50).trim().required(),
        email: joi.string().email().min(5).max(50).trim().required(),
        description: joi.string().max(500).trim().allow(null),
        photo_url: joi.string().min(5).max(200).trim().allow(null),
        status: joi.string().trim().valid('active', 'deactive').required()
      });
      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) {
        console.log(error);
        return res.json(error);
        // return response.validation(res, error);
      }
      // Helper.NullObj(value);
      const user = await createUser(value);
      if (!user) return response.customError(res, 'An error has occurred', 500);

      // await auther.GetEnforcer().deleteRoleForUser(user!._id + '', user!.role);
      // await auther.GetEnforcer().addRoleForUser(user!._id + '', value.role);
      return res.json(user);
      // return response.success(res, user, res.t('CRUD.Create'));
    } catch (error) {
      return res.json(error);
      // return response.catchError(res, error);
    }
  }
};
