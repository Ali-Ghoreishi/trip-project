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
import { CVIsMobile, CVLength } from '../base';
import { IDriverInput } from '../../../db/models/Driver';

export class RegisterSendCode_validator {
  @CVIsMobile('mobile')
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IDriverInput['mobile'];
}
export class RegisterVerifyCode_validator {
  //   @CVLength(24)
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
  username!: IDriverInput['username'];

  @MaxLength(30, { message: '30' })
  @MinLength(8, { message: '8' })
  @IsString()
  @IsNotEmpty()
  password!: IDriverInput['password'];

  @MaxLength(50, { message: '50' })
  @MinLength(4, { message: '4' })
  @IsString()
  @IsNotEmpty()
  fullname!: IDriverInput['fullname'];

  @IsEmail()
  @IsNotEmpty()
  email!: IDriverInput['email'];

  @CVIsMobile('mobile')
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IDriverInput['mobile'];

  @MaxLength(50, { message: '50' })
  @MinLength(5, { message: '5' })
  @IsString()
  @IsNotEmpty()
  address!: IDriverInput['address'];

  @MaxLength(200, { message: '200' })
  @MinLength(5, { message: '5' })
  @IsString()
  photo_url!: IDriverInput['photo_url'];

  @MaxLength(300, { message: '300' })
  @MinLength(1, { message: '1' })
  @IsString()
  description!: IDriverInput['description'];
}
export class LoginByUsernamePassword_validator {
  // @IsString({ message: 'username should be a string' })
  @MaxLength(30, { message: '30' })
  @MinLength(6, { message: '6' })
  @IsString()
  @IsNotEmpty()
  username!: IDriverInput['username'];

  @MaxLength(50, { message: '50' })
  @MinLength(8, { message: '8' })
  @IsString()
  @IsNotEmpty()
  password!: IDriverInput['password'];
}

export class LoginByMobileSendCode_validator {
  @CVIsMobile('mobile' /* , { message: 'please enter valid mobile' } */)
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IDriverInput['mobile'];
}

export class LoginByMobileVerifyCode_validator {
  @CVIsMobile('mobile' /* , { message: 'please enter valid mobile' } */)
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IDriverInput['mobile'];

  @IsNumber()
  @IsNotEmpty()
  code!: number;
}
