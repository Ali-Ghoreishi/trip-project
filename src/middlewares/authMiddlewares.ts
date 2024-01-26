import { Request, Response, NextFunction } from 'express';

import { AuthHandler } from '../components/auth/index';
import response from '../components/responseHandler';
import { StatusEnum } from '../types/custom/enum';
import { findDriver } from '../services/driver';

export const authMiddleware = {
  user: async (req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0].toLocaleLowerCase() === 'bearer'
    ) {
      try {
        const { user } = await AuthHandler.UserTokenVerify(req.headers.authorization.split(' ')[1], res); // Verify JWT
        if (user.status !== StatusEnum.active) {
          if (user.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
          if (user.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
        }
        req.user = user;
        next();
      } catch (error) {
        req.user = undefined;
        return response.catchError(res, error);
      }
    } else {
      req.user = undefined;
      return response.customError(res, res.t('statusCode.401'), 401);
    }
  },

  passenger: async (req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0].toLocaleLowerCase() === 'bearer'
    ) {
      try {
        const { passenger } = await AuthHandler.PassengerTokenVerify(req.headers.authorization.split(' ')[1], res); // Verify JWT
        if (passenger.status !== StatusEnum.active) {
          if (passenger.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
          if (passenger.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
        }
        req.passenger = passenger;
        next();
      } catch (error) {
        req.passenger = undefined;
        return response.catchError(res, error);
      }
    } else {
      req.passenger = undefined;
      return response.customError(res, res.t('statusCode.401'), 401);
    }
  },

  driver: async (req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0].toLocaleLowerCase() === 'bearer'
      //   req.headers.sessionid
    ) {
      try {
        const { driver } = await AuthHandler.DriverTokenVerify(req.headers.authorization.split(' ')[1], res); // Verify JWT
        // const check_session = await findDriver({ _id: driver._id, sessionid: req.headers.sessionid });
        // if (!check_session) {
        //   return response.customError(res, res.t('auth.Session_Expired'), 403);
        // }

        if (driver.status !== StatusEnum.active) {
          if (driver.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
          if (driver.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
        }
        req.driver = driver;
        next();
      } catch (error) {
        req.driver = undefined;
        return response.catchError(res, error);
      }
    } else {
      req.driver = undefined;
      return response.customError(res, res.t('statusCode.401'), 401);
    }
  }
};
