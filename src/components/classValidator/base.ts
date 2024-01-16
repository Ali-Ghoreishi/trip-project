// // import { IsString, IsNotEmpty, IsMobilePhone } from 'class-validator';
// import {
//   validate,
//   validateOrReject,
//   Contains,
//   IsString,
//   IsInt,
//   Length,
//   IsEmail,
//   IsFQDN,
//   IsDate,
//   Min,
//   Max
// } from 'class-validator';

// export class BaseValidator {
//   @IsString({ message: 'Fullname should be a string' })
//   @IsNotEmpty({ message: 'Fullname is required' })
//   fullname: string;

//   @IsMobilePhone('any', { message: 'Invalid mobile phone number' })
//   @IsNotEmpty({ message: 'Mobile is required' })
//   mobile: string;

//   @IsString({ message: 'Username should be a string' })
//   @IsNotEmpty({ message: 'Username is required' })
//   username: string;

//   @IsString({ message: 'Password should be a string' })
//   @IsNotEmpty({ message: 'Password is required' })
//   password: string;
// }
