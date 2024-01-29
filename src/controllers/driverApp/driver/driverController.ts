import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import { findCar } from '../../../services/car';
import { ICar } from '../../../db/models/Car';
import { StatusEnum } from '../../../types/custom/enum';
import { findAndUpdateDriver, findDriver } from '../../../services/driver';

export const DriverController = {
  dashboard: async (req: Request, res: Response) => {
    try {
      const driver = await findDriver({ _id: req.driver!._id }, null, {}, [{ path: 'car_id' /* , select: 'model' */ }]);
      return response.success(res, { driver }, res.t('crud.success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  }
};
