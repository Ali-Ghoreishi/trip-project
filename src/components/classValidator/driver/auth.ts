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
import { IDriverInput } from '../../../db/models/Driver';

export class RegisterSendCode_validator {
  @CVIsMobile('mobile')
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: string;
}
export class RegisterVerifyCode_validator {
  //   @Length(24)
  //   @IsString()
  //   @IsNotEmpty()
  //   car_id!: IDriverInput['car_id'];

  @IsNumber()
  @IsNotEmpty()
  code!: number;

  @MaxLength(30, { message: '30' })
  @MinLength(6, { message: '6' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @MaxLength(30, { message: '30' })
  @MinLength(8, { message: '8' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @MaxLength(50, { message: '50' })
  @MinLength(4, { message: '4' })
  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @CVIsMobile('mobile')
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: string;

  @MaxLength(50, { message: '50' })
  @MinLength(5, { message: '5' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @MaxLength(200, { message: '200' })
  @MinLength(1, { message: '1' })
  @IsString()
  photo_url!: string;

  @MaxLength(30, { message: '30' })
  @MinLength(6, { message: '6' })
  @IsString()
  description!: string;
}
export class LoginByUsernamePassword_validator {
  // @IsString({ message: 'username should be a string' })
  @MaxLength(30, { message: '30' })
  @MinLength(6, { message: '6' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @MaxLength(50, { message: '50' })
  @MinLength(8, { message: '8' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginByMobileSendCode_validator {
  @CVIsMobile('mobile' /* , { message: 'please enter valid mobile' } */)
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: string;
}

export class LoginByMobileVerifyCode_validator {
  @CVIsMobile('mobile' /* , { message: 'please enter valid mobile' } */)
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: string;

  @IsNumber()
  @IsNotEmpty()
  code!: number;
}
