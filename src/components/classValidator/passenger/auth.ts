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
import { IPassengerInput } from '../../../db/models/Passenger';

export class RegisterSendCode_validator {
  @CVIsMobile('mobile')
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IPassengerInput['mobile'];
}
export class RegisterVerifyCode_validator {
  @IsNumber()
  @IsNotEmpty()
  code!: number;

  @MaxLength(30, { message: '30' })
  @MinLength(6, { message: '6' })
  @IsString()
  @IsNotEmpty()
  username!: IPassengerInput['username'];

  @MaxLength(30, { message: '30' })
  @MinLength(8, { message: '8' })
  @IsString()
  @IsNotEmpty()
  password!: IPassengerInput['password'];

  @MaxLength(50, { message: '50' })
  @MinLength(4, { message: '4' })
  @IsString()
  @IsNotEmpty()
  fullname!: IPassengerInput['fullname'];

  @IsEmail()
  @IsNotEmpty()
  email!: IPassengerInput['email'];

  @CVIsMobile('mobile')
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IPassengerInput['mobile'];

  @MaxLength(200, { message: '200' })
  @MinLength(5, { message: '5' })
  @IsString()
  photo_url!: IPassengerInput['photo_url'];

  @MaxLength(300, { message: '300' })
  @MinLength(1, { message: '1' })
  @IsString()
  description!: IPassengerInput['description'];
}
export class LoginByUsernamePassword_validator {
  // @IsString({ message: 'username should be a string' })
  @MaxLength(30, { message: '30' })
  @MinLength(6, { message: '6' })
  @IsString()
  @IsNotEmpty()
  username!: IPassengerInput['username'];

  @MaxLength(50, { message: '50' })
  @MinLength(8, { message: '8' })
  @IsString()
  @IsNotEmpty()
  password!: IPassengerInput['password'];
}

export class LoginByMobileSendCode_validator {
  @CVIsMobile('mobile' /* , { message: 'please enter valid mobile' } */)
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IPassengerInput['mobile'];
}

export class LoginByMobileVerifyCode_validator {
  @CVIsMobile('mobile' /* , { message: 'please enter valid mobile' } */)
  @MaxLength(11, { message: '11' })
  @MinLength(10, { message: '10' })
  @IsString()
  @IsNotEmpty()
  mobile!: IPassengerInput['mobile'];

  @IsNumber()
  @IsNotEmpty()
  code!: number;
}
