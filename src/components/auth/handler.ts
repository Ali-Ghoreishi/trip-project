import jwt from 'jsonwebtoken';
import { Response } from 'express';

import { findUser, findAndUpdateUser } from '../../services/user';
import { findAndUpdatePassenger, findPassenger } from '../../services/passenger';
import { IUser } from '../../db/models/User';
import { IPassenger } from '../../db/models/Passenger';
import { IDriver } from '../../db/models/Driver';
import { findAndUpdateDriver, findDriver } from '../../services/driver';
import { StatusEnum } from '../../types/custom/enum';
import CustomError from '../errorHandler';


export default class AuthHandler {
  static jwtSecret = process.env.JWT_SECRET;

  static async UserTokenGenerate(user: IUser, type = 'user') {
    try {
      const token = jwt.sign({ _type: 'user' /* tokenVersion: user.tokenVersion */ }, this.jwtSecret!, {
        subject: user._id + '',
        expiresIn: process.env.JWT_EXPIRE_PORTAL
      });
      const lastloginToken = jwt.decode(token);
      if (typeof lastloginToken === 'object' && lastloginToken !== null) {
        await findAndUpdateUser({ _id: user._id }, { lastLoginAt: lastloginToken.iat! * 1000 });
      }
      return { token };
    } catch (error) {
      throw error;
    }
  }

  static async DriverTokenGenerate(driver: IDriver, type = 'driver') {
    try {
      const token = jwt.sign({ _type: 'driver' /* tokenVersion: driver.tokenVersion */ }, this.jwtSecret!, {
        subject: driver._id + '',
        expiresIn: process.env.JWT_EXPIRE_DRIVER
      });
      const lastloginToken = jwt.decode(token);
      if (typeof lastloginToken === 'object' && lastloginToken !== null) {
        await findAndUpdateDriver({ _id: driver._id }, { lastLoginAt: lastloginToken.iat! * 1000 });
      }
      return { token };
    } catch (error) {
      throw error;
    }
  }

  static async PassengerTokenGenerate(passenger: IPassenger, type = 'passenger') {
    try {
      const token = jwt.sign({ _type: 'passenger' /* tokenVersion: passenger.tokenVersion */ }, this.jwtSecret!, {
        subject: passenger._id + '',
        expiresIn: process.env.JWT_EXPIRE_PASSENGER
      });
      const lastloginToken = jwt.decode(token);
      if (typeof lastloginToken === 'object' && lastloginToken !== null) {
        await findAndUpdatePassenger({ _id: passenger._id }, { lastLoginAt: lastloginToken.iat! * 1000 });
      }
      return { token };
    } catch (error) {
      throw error;
    }
  }

  static async UserTokenVerify(token: string, res: Response) {
    try {
      const decode = jwt.verify(token, this.jwtSecret!);
      const user = await findUser({ _id: decode.sub });
      if (user) {
        // if (user.tokenVersion !== decode.tokenVersion) throw new CustomError(res.t('statusCode.401'), 401);
        if (user.status === StatusEnum.active) {
          return { user, decode };
        } else {
          if (user.status === StatusEnum.deactive) throw new CustomError(res.t('auth.deactive'), 403);
          if (user.status === StatusEnum.blocked) throw new CustomError(res.t('auth.blocked'), 403);
        }
      }
      throw new CustomError(res.t('crud.notFound', { name: res.t('field.user') }), 404);
    } catch (error) {
      throw error;
    }
  }

  static async DriverTokenVerify(token: string, res: Response) {
    try {
      const decode = jwt.verify(token, this.jwtSecret!);
      const driver = await findDriver({ _id: decode.sub });
      if (driver) {
        // if (driver.tokenVersion !== decode.tokenVersion) throw new CustomError(res.t('statusCode.401'), 401);
        if (driver.status === StatusEnum.active) {
          return { driver, decode };
        } else {
          if (driver.status === StatusEnum.deactive) throw new CustomError(res.t('auth.deactive'), 403);
          if (driver.status === StatusEnum.blocked) throw new CustomError(res.t('auth.blocked'), 403);
        }
      }
      throw new CustomError(res.t('crud.notFound', { name: res.t('field.driver') }), 404);
    } catch (error) {
      throw error;
    }
  }

  static async PassengerTokenVerify(token: string, res: Response) {
    try {
      const decode = jwt.verify(token, this.jwtSecret!);
      const passenger = await findPassenger({ _id: decode.sub });
      if (passenger) {
        // if (passenger.tokenVersion !== decode.tokenVersion) throw new CustomError(res.t('statusCode.401'), 401);
        if (passenger.status === StatusEnum.active) {
          return { passenger, decode };
        } else {
          if (passenger.status === StatusEnum.deactive) throw new CustomError(res.t('auth.deactive'), 403);
          if (passenger.status === StatusEnum.blocked) throw new CustomError(res.t('auth.blocked'), 403);
        }
      }
      throw new CustomError(res.t('crud.notFound', { name: res.t('field.passenger') }), 404);
    } catch (error) {
      throw error;
    }
  }
}
