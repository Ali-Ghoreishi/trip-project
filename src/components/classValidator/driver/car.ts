import {
  validate,
  validateOrReject,
  Contains,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsObject,
  ValidateNested,
  Length,
  IsEmail,
  IsDate,
  Min,
  IsInstance,
  Max,
  MinLength,
  MaxLength,
  IsNumber,
  IsMongoId
} from 'class-validator';
import { CVIsMobile, CVLength } from '../base';
import { ICarInput } from '../../../db/models/Car';

export class RegisterByDriver_validator {
  driver_id!: ICarInput['driver_id'];
  plaque!: ICarInput['plaque'];

  @CVLength(24)
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  service_id!: ICarInput['service_id'];

  @MaxLength(50, { message: '50' })
  @MinLength(1, { message: '1' })
  @IsString()
  @IsNotEmpty()
  model!: ICarInput['model'];

  @MaxLength(100, { message: '100' })
  @MinLength(1, { message: '1' })
  @IsString()
  @IsNotEmpty()
  chassis_number!: ICarInput['chassis_number'];

  @MaxLength(50, { message: '50' })
  @MinLength(1, { message: '1' })
  @IsString()
  @IsNotEmpty()
  color!: ICarInput['color'];

  @IsNumber()
  @IsNotEmpty()
  year!: ICarInput['year'];

  @CVLength(6)
  @IsString()
  @IsNotEmpty()
  plaquePart1!: ICarInput['plaque']['part1'];

  @CVLength(2)
  @IsString()
  @IsNotEmpty()
  plaquePart2!: ICarInput['plaque']['part2'];

  @MaxLength(200, { message: '200' })
  @MinLength(5, { message: '5' })
  @IsString()
  @IsNotEmpty()
  photo_url!: ICarInput['photo_url'];

  @MaxLength(300, { message: '300' })
  @MinLength(1, { message: '1' })
  @IsString()
  description!: ICarInput['description'];
}
