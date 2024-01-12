import joi from 'joi';
import { Request, Response } from 'express';

// import response from '../../../../components/responseHandler';
import User, { IUser } from '../../../db/models/User';
import { createUser } from '../../../services/user';

export const UserController = {
  create: async (req: Request, res: Response) => {
    try {
      // let auther = await rbac();
      // let rawRoles = await auther.GetEnforcer().getAllSubjects();

      const schema = joi.object().keys({
        username: joi.string().min(4).max(30).trim().alphanum().required(),
        //@ts-ignore
        // password: joi.string().custom(Helper.JOI('password')).required(),
        fullname: joi.string().max(50).trim().required(),
        email: joi.string().email().min(5).max(50).trim().required(),
        // mobile: joi
        //   .string()
        //   .trim()
        //   .min(10)
        //   .max(11)
        //   .pattern(/^[0-9]+$/)
        //   //@ts-ignore
        //   .custom(Helper.JOI('mobile'))
        //   .required(),
        // emergency_phone: joi
        //   .string()
        //   .trim()
        //   .min(10)
        //   .max(11)
        //   .pattern(/^[0-9]+$/)
        //   //@ts-ignore
        //   .custom(Helper.JOI('mobile'))
        //   .required(),
        // address: joi.string().max(255).trim().required(),
        // company_id: joi.string().trim().min(24).max(24).allow(null),
        // parent_id: joi.string().trim().min(24).max(24).allow(null),
        description: joi.string().max(500).trim().allow(null),
        photo_url: joi.string().min(5).max(200).trim().allow(null),
        // ip: joi.string().trim().max(50).allow(null),
        // role: joi
        //   .string()
        //   .only()
        //   .allow(...rawRoles)
        //   .required(),
        status: joi.string().trim().valid('active', 'deactive').required(),
        // limited_user: joi.string().valid('no', 'yes').allow(null)
      });
      const { error, value } = schema.validate(req.body, { abortEarly: true });
      if (error) {
        console.log(error);
        return res.json(error);
        // return response.validation(res, error);
      }
      // Helper.NullObj(value);
      const user = await createUser(value);

      // await auther.GetEnforcer().deleteRoleForUser(user!._id + '', user!.role);
      // await auther.GetEnforcer().addRoleForUser(user!._id + '', value.role);
      return res.json(user)
      // return response.success(res, user, res.t('CRUD.Create'));
    } catch (error) {
      return res.json(error);
      // return response.catchError(res, error);
    }
  },
};
