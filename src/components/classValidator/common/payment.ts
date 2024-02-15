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
  IsNumber
} from 'class-validator';
import { CVIsMobile } from '../base';
import { IUserInput } from '../../../db/models/User';

export class Verify_validator {

  @IsNumber()
  status!: number;

  @IsNumber()
  track_id!: number;

  @IsString()
  id!: string;

  @IsString()
  order_id!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  card_no!: string;

  @IsString()
  hashed_card_no!: string;

  @IsString()
  date!: string;
}
