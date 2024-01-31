import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import Car, { ICar } from '../../../db/models/Car';
import { StatusEnum } from '../../../types/custom/enum';
import { List_validator, Update_validator } from '../../../components/classValidator/portal/car';
import Helper from '../../../components/helper';
import { findAndUpdateCar, findCar } from '../../../services/car';

export const CarController = {
  list: async (req: Request, res: Response) => {
    try {
      const input = new List_validator();
      Object.assign(input, req.query);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const query: any[] = [];
      query.push({
        $lookup: {
          from: 'Drivers',
          localField: 'driver_id',
          foreignField: '_id',
          as: 'driver_data',
          pipeline: [
            //   {
            //     $match: where_driver
            //   },
            {
              $project: { fullname: 1, mobile: 1, _id: 1, ID: 1, email: 1 }
            }
          ]
        }
      });
      query.push({ $unwind: '$driver_data' });
      const result = await Helper.List(Car, query, { ...input });
      return response.success(res, result, res.t('crud.success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const input = new Update_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const car = await findAndUpdateCar(
        { _id: input.id },
        { ...input, 'extraData.updater_id': req.user!._id }
      );
      if (!car) return response.customError(res, res.t('crud.notFound', { name: res.t('field.car') }), 404);
      return response.success(res, car, res.t('crud.success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  }
};
