import {
  validate,
  validateOrReject,
  Contains,
  IsEmpty,
  IsNotEmpty,
  IsString,
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
  IsMongoId,
  IsPositive
} from 'class-validator';
import { CVIsMobile, CVLength } from '../base';

export class Charge_validator {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;
}
