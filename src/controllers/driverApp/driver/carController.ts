import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import { RegisterByDriver_validator } from '../../../components/classValidator/driver/car';
import { findService } from '../../../services/service';
import { createCar, findCar } from '../../../services/car';
import { ICar } from '../../../db/models/Car';
import { StatusEnum } from '../../../types/custom/enum';
import { findAndUpdateDriver } from '../../../services/driver';

export const CarController = {
  registerByDriver: async (req: Request, res: Response) => {
    try {
      const input = new RegisterByDriver_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      input.plaque = { part1: input.plaquePart1, part2: input.plaquePart2 };

      const driver = req.driver!;
      if (driver.car_id) return response.customError(res, res.t('driver.alreadyRegisteredOwnCar'), 400);
      input.driver_id = driver._id;

      const service = await findService({ _id: input.service_id, deleted: false });
      if (!service) return response.customError(res, res.t('crud.notFound', { name: res.t('field.service') }), 404);
      const checkChassis_number = await findCar({ chassis_number: input.chassis_number });
      if (checkChassis_number)
        return response.customError(res, res.t('crud.already_exist', { name: res.t('field.chassis_number') }), 409);
      const checkPlaque = await findCar({ plaque: input.plaque });
      if (checkPlaque)
        return response.customError(res, res.t('crud.already_exist', { name: res.t('field.plaque') }), 409);

      const creationData: ICar = {
        ...input,
        status: StatusEnum.deactive,
        extraData: {
          creator_id: driver._id
        }
      };
      const car = await createCar(creationData);
      await findAndUpdateDriver({ _id: driver._id }, { car_id: car._id });
      return response.success(res, { car }, res.t('crud.create'));
    } catch (err) {
      return response.catchError(res, err);
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      const driver = req.driver!;
      if (driver.car_id === null)
        return response.customError(res, res.t('crud.notFound', { name: res.t('field.car') }), 404);
      const car = await findCar({ _id: driver.car_id });
      if (!car) return response.customError(res, res.t('crud.notFound', { name: res.t('field.car') }), 404);
      return response.success(res, { car }, res.t('crud.success'))
    } catch (err) {
      return response.catchError(res, err);
    }
  }
};
