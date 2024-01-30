import {
  validate,
  validateOrReject,
  Contains,
  IsEmpty,
  IsNotEmpty,
    IsString,
  IsNumberString,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsIn
} from 'class-validator';
import { CVIsMobile } from '../base';
import { IUserInput } from '../../../db/models/User';

export class List_validator {
  @IsNumberString()
  @IsNotEmpty()
  page!: string;

  @IsNumberString()
  @IsNotEmpty()
  limit!: string;

  @IsString()
  @IsNotEmpty()
  sortField!: string;

  @IsIn(['1', '-1'])
  @IsString()
  @IsNotEmpty()
  sortOrder!: '1' | '-1'
}
