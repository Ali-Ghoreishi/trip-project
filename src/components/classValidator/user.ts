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
  MaxLength
} from 'class-validator';


export class loginByUsernamePassword_validator {
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


