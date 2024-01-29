import {
  validate,
  validateOrReject,
  Contains,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsIn
} from 'class-validator';
import { Type } from 'class-transformer';

import { rbac } from '../../auth/index';
import { CVLength } from '../base';

let auther;
let validObjs = [] as string[];
let validActs = [] as string[];
let validRoles = [] as string[];
(async () => {
  auther = await rbac();
  validObjs = await auther.GetEnforcer().getAllObjects();
  validActs = (await auther.GetEnforcer().getAllActions()).filter((act: string) => act);
  validRoles = await auther.GetEnforcer().getAllSubjects();
})();

class Permission {
  @IsIn(validObjs)
  @IsString()
  @IsNotEmpty()
  obj!: string;

  @ValidateNested({ each: true })
  @Type(() => String)
  @IsIn(validActs)
  @ArrayMinSize(1)
  @IsArray()
  acts!: string[];
}

export class ListRolePermissions_validator {
  @MaxLength(100, { message: '100' })
  //   @MinLength(6, { message: '6' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class ListUserPermissions_validator {
  @CVLength(24)
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export class CreateRole_validator {
  @MaxLength(20, { message: '20' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Permission)
  permissions!: Permission[];
}

export class AddRoleToUser_validator {
  @CVLength(24)
  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @IsIn(validRoles)
  @IsString()
  @IsNotEmpty()
  role!: string;
}

export class DeleteRole_validator {
  //   @IsIn(validRoles)
  @IsString()
  @IsNotEmpty()
  role!: string;
}

export class DeletePermissions_validator {
  @ArrayMinSize(1)
  @IsArray()
  permissions!: any[];
}

export class UpdateRole_validator {
  @MaxLength(20, { message: '20' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @MaxLength(20, { message: '20' })
  @IsString()
//   @IsNotEmpty()
  newTitle!: string;

  @IsArray()
//   @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Permission)
  permissions!: Permission[];
}
