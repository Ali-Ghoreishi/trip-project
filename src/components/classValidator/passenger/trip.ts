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
  IsMongoId
} from 'class-validator';
import { CVIsMobile, CVLength } from '../base';
import { ITripInput } from '../../../db/models/Trip';

export class Register_validator {
  @IsMongoId()
  @IsNotEmpty()
  source!: ITripInput['source'];

  @IsMongoId()
  @IsNotEmpty()
  destination!: ITripInput['destination'];

  @MaxLength(300, { message: '300' })
  @MinLength(1, { message: '1' })
  @IsString()
  @IsNotEmpty()
  description!: ITripInput['description'];
}
