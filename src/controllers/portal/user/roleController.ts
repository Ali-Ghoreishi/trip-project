import { Request, Response } from 'express';
import { validate as inputValidate } from 'class-validator';

import response from '../../../components/responseHandler';
import { rbac } from '../../../components/auth/index';
import { findUsers, findAndUpdateUser } from '../../../services/user';
import User from '../../../db/models/User';
import { StaticRoleEnum } from '../../../types/custom/enum';
import {
  AddRoleToUser_validator,
  CreateRole_validator,
  DeletePermissions_validator,
  DeleteRole_validator,
  ListRolePermissions_validator,
  ListUserPermissions_validator,
  UpdateRole_validator
} from './../../../components/classValidator/portal/role';

export const RoleController = {
  formatPermissions: async (rawpermissions: any, res: Response) => {
    try {
      let perms: any = {};
      for (const per of rawpermissions) {
        if (perms[per[1]]) {
          perms[per[1]].push({
            act: per[2],
            title: res.t(per[2], { scope: 'perm.act' })
          });
        } else {
          perms[per[1]] = [
            {
              act: per[2],
              title: res.t(per[2], { scope: 'perm.act' })
            }
          ];
        }
      }
      let permissions = [];
      for (const key in perms) {
        permissions.push({
          obj: key,
          title: res.t(key, { scope: 'perm.obj' }),
          acts: perms[key]
        });
      }
      return permissions;
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  listAllPermissions: async (req: Request, res: Response) => {
    try {
      const auther = await rbac();
      let rawpermissions = await auther.GetEnforcer().getImplicitPermissionsForUser(StaticRoleEnum.Admin);
      const formatedPermissions = await RoleController.formatPermissions(rawpermissions, res);
      return response.success(res, formatedPermissions, res.t('crud.success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  listAllRoles: async (req: Request, res: Response) => {
    try {
      const auther = await rbac();
      const rawRoles = await auther.GetEnforcer().getAllSubjects();
      const newArray = [];
      let index_ = rawRoles.length - 1;
      for (const i in rawRoles) {
        newArray.push(rawRoles[index_]);
        index_--;
      }
      const data = {
        count: rawRoles.length,
        data: [...newArray]
      };
      return response.success(res, data, res.t('crud.success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  // getAll: async (req: Request, res: Response) => {
  //   try {
  //     let auther = await rbac();
  //     const rawRoles = await auther.GetEnforcer().getAllSubjects();

  //     const newArray = [];
  //     let index_ = rawRoles.length - 1;
  //     for (const i in rawRoles) {
  //       newArray.push(rawRoles[index_]);
  //       index_--;
  //     }
  //     const data = {
  //       count: rawRoles.length,
  //       data: [...newArray]
  //     };

  //     return response.success(res, data, res.t('CRUD.Success'));
  //   } catch (error) {
  //     return response.catchError(res, error);
  //   }
  // },

  //* Get the List of Permissions Role has
  listRolePermissions: async (req: Request, res: Response) => {
    try {
      const input = new ListRolePermissions_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const auther = await rbac();
      let rawpermissions = await auther.GetEnforcer().getImplicitPermissionsForUser(input.name);
      let roles = await auther.GetEnforcer().getImplicitRolesForUser(input.name);
      return response.success(
        res,
        {
          roles,
          permissions: await RoleController.formatPermissions(rawpermissions, res)
        },
        res.t('crud.success')
      );
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //* Get List of Own Permissions for User
  listMyPermissions: async (req: Request, res: Response) => {
    try {
      const auther = await rbac();
      let rawRoles = await auther.GetEnforcer().getRolesForUser(req.user!._id + '');
      let rawpermissions = await auther.GetEnforcer().getPermissionsForUser(rawRoles[0]);
      const formatedPermissions = await RoleController.formatPermissions(rawpermissions, res);
      return response.success(res, formatedPermissions, res.t('crud.success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //* Get the List of Roles a User has
  listMyRoles: async (req: Request, res: Response) => {
    try {
      const auther = await rbac();
      let rawRoles = await auther.GetEnforcer().getImplicitRolesForUser(req.user!._id + '');
      return response.success(res, rawRoles, res.t('crud.success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  },

  //* Get the List of Permissions a User has
  listUserPermissions: async (req: Request, res: Response) => {
    try {
      const input = new ListUserPermissions_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const auther = await rbac();
      let rawpermissions = await auther.GetEnforcer().getImplicitPermissionsForUser(input.id + '');
      const formatedPermissions = await RoleController.formatPermissions(rawpermissions, res);
      return response.success(res, formatedPermissions, res.t('crud.success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  createRole: async (req: Request, res: Response) => {
    try {
      const input = new CreateRole_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const auther = await rbac();
      const rawRoles = await auther.GetEnforcer().getAllSubjects();
      if (rawRoles.includes(input.title)) {
        return response.customError(res, res.t('already_exist', { name: res.t('field.role') }), 400);
      }
      if (input.permissions) {
        if (input.permissions.length === 0) {
          return response.customError(res, res.t('crud.required', { name: res.t('field.permissions') }), 400);
        } else {
          let objCounter = 0;
          let actCounter = 0;
          for (const perm of input.permissions) {
            if (perm.obj && perm.obj !== '') objCounter++;
            if (perm.acts && perm.acts.length > 0) actCounter++;
          }
          if (objCounter === 0 || actCounter === 0)
            return response.customError(res, res.t('crud.required', { name: res.t('field.permissions') }), 400);
        }
      }
      for (const perm of input.permissions) {
        for (const act of perm.acts) {
          await auther.AddPermission(input.title, perm.obj, act);
        }
      }
      return response.success(res, {}, res.t('crud.success'));
    } catch (error) {
      console.log(error);
      return response.catchError(res, error);
    }
  },

  addRoleToUser: async (req: Request, res: Response) => {
    try {
      const input = new AddRoleToUser_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const auther = await rbac();
      await findAndUpdateUser({ _id: input.user_id }, { role: input.role });
      await auther.GetEnforcer().addRoleForUser(input.user_id + '', input.role);
      return response.success(res, {}, res.t('crud.success'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  //* Delete a Role and Permissions to the Role
  deleteRole: async (req: Request, res: Response) => {
    try {
      const input = new DeleteRole_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const auther = await rbac();
      await auther.GetEnforcer().deleteRole(input.role);
      return response.success(res, {}, res.t('crud.deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  deleteAllRoles: async (req: Request, res: Response) => {
    try {
      const auther = await rbac();
      let rawRoles = await auther.GetEnforcer().getAllSubjects();
      rawRoles = rawRoles.filter((item: string) => item !== StaticRoleEnum.Admin);
      const deletedRoles = [];
      for (const role of rawRoles) {
        const deletedRole = await auther.GetEnforcer().deleteRole(role);
        deletedRoles.push(deletedRole);
      }
      return response.success(res, deletedRoles, res.t('crud.deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  deletePermissions: async (req: Request, res: Response) => {
    try {
      const input = new DeletePermissions_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const auther = await rbac();
      const permissions = input.permissions;
      for (const perm of permissions) {
        if (perm.obj && perm.act) {
          await auther.GetEnforcer().deletePermission(perm.obj, perm.act);
        } else {
          await auther.GetEnforcer().deletePermission(perm.obj);
        }
      }
      return response.success(res, {}, res.t('crud.deleted'));
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  getIdsHaveThisRole: async (title: string) => {
    const auther = await rbac();
    let ids: any[] = [];
    const users = await User.find({}).select('_id');
    await Promise.all(
      users.map(async (el) => {
        let roles = await auther.GetEnforcer().getImplicitRolesForUser(el._id + '');
        roles.map((role: any) => {
          if (role == title) ids.push(el._id + '');
        });
      })
    );
    return ids;
  },

  // RoleBackManges: async (ids: string[], title: string) => {
  //   let auther = await rbac();
  //   await Promise.all(
  //     ids.map(async (id) => {
  //       await auther.GetEnforcer().addRoleForUser(id, title);
  //     })
  //   );
  //   return true;
  // },

  // updateRole: async (req: Request, res: Response) => {
  //   try {
  //     const input = new UpdateRole_validator();
  //     Object.assign(input, req.body);
  //     const inputValidateErrors = await inputValidate(input);
  //     if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
  //     const auther = await rbac();
  //     const rawRoles = await auther.GetEnforcer().getAllSubjects();
  //     if (input.title === StaticRoleEnum.Admin)
  //       return response.customError(res, res.t('role.cantModifyAdminRole'), 400);
  //     if (!input.newTitle) {
  //       input.newTitle = input.title;
  //     } else {
  //       if (rawRoles.includes(input.title)) {
  //         return response.customError(res, res.t('crud.already_exist', { name: res.t('field.role') }), 400);
  //       }
  //     }

  //     if (input.permissions) {
  //       if (input.permissions.length === 0) {
  //         return response.customError(res, res.t('crud.required', { name: res.t('field.permission') }), 400);
  //       } else {
  //         let objCounter = 0;
  //         let actCounter = 0;
  //         for (const perm of input.permissions) {
  //           if (perm.obj && perm.obj !== '') objCounter++;
  //           if (perm.acts && perm.acts.length > 0) actCounter++;
  //         }
  //         if (objCounter === 0 || actCounter === 0)
  //           return response.customError(res, res.t('crud.required', { name: res.t('field.permission') }), 400);
  //       }
  //     }
  //     let ids = await RoleController.getIdsHaveThisRole(input.title);
  //     await auther.GetEnforcer().deleteRole(input.title);
  //     for (const perm of input.permissions) {
  //       for (const act of perm.acts) {
  //         await auther.AddPermission(input.newTitle, perm.obj, act);
  //       }
  //     }
  //     // await RoleController.RoleBackManges(ids, value.newTitle);
  //     const { data } = await findUsers({ role: input.title });
  //     for (let index = 0; index < data.length; index++) {
  //       await auther.GetEnforcer().addRoleForUser(data[index]._id + '', input.newTitle);
  //     }
  //     return response.success(res, {}, res.t('crud.update'));
  //   } catch (error) {
  //     return response.catchError(res, error);
  //   }
  // }
};
