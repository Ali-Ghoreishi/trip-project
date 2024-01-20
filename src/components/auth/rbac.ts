import { newEnforcer } from 'casbin';
import { MongoAdapter } from 'casbin-mongodb-adapter';

import path from 'path';

import { IUser } from '../../db/models/User';
import Helper from '../helper';

let auther: any = {};

export default async () => {
  try {
    if (auther.Enforcer) {
      return auther;
    }
    if (!process.env.DB_NAME) throw new Error('ENV Not Found');
    const uri = Helper.GetDatabaseURI() as string;
    auther = new Authz();
    const adapter = await MongoAdapter.newAdapter({
      uri: uri,
      collection: 'casbin',
      database: process.env.DB_NAME
    });

    auther.Enforcer = await newEnforcer(path.join(__dirname, 'rbac_model.conf'), adapter);
    await auther.Enforcer.loadPolicy();
    return auther;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

class Authz {
  Enforcer: any;
  
  async AddRole(user: IUser, roleName: string) {
    return await this.Enforcer.addRoleForUser(user._id + '', roleName);
  }

  async AddPermission(sub: string, obj: string, act: string) {
    return await this.Enforcer.addPermissionForUser(sub, obj, act);
  }

  async DeletePermission(sub: string, obj: string, act: string) {
    return await this.Enforcer.deletePermissionForUser(sub, obj, act);
  }

  async GetPermissions(sub: string) {
    if (sub) return await this.Enforcer.getPermissionsForUser(sub);

    return await this.Enforcer.getAllActions();
  }
  GetEnforcer() {
    return this.Enforcer;
  }

  async GetRoles(sub: string) {
    if (sub) {
      let roles = await this.Enforcer.getRolesForUser(sub);
      return roles;
    }

    return await this.Enforcer.getAllRoles();
  }
}
