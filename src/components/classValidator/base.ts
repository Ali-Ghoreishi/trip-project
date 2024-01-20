// import { IsString, IsNotEmpty, IsMobilePhone } from 'class-validator';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  validate,
  validateOrReject,
  Contains,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max
} from 'class-validator';

export function CVIsMobile(property: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'cvIsMobile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (!value) return false;
          const firstDigit = value[0];
          const first2Digit = `${value[0]}${value[1]}`;
          if (value.length === 10) {
            if (firstDigit === '9') {
              value = `0${value}`;
            } else {
              return false;
            }
          } else if (value.length === 11) {
            if (first2Digit !== '09') return false;
          }
          return true;
        }
        }
    });
  };
}
