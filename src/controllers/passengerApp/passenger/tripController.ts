import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import { StatusEnum } from '../../../types/custom/enum';
import { findPassenger } from '../../../services/passenger';
import { Register_validator } from '../../../components/classValidator/passenger/trip';

export const TripController = {
  register: async (req: Request, res: Response) => {
    try {
      const input = new Register_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);

      const passenger = req.passenger!;

      return response.success(res, { passenger }, res.t('crud.success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  }
};
