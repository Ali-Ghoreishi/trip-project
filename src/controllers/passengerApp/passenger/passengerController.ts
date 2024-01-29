import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import { StatusEnum } from '../../../types/custom/enum';
import { findPassenger } from '../../../services/passenger';

export const PassengerController = {
  dashboard: async (req: Request, res: Response) => {
    try {
      return response.success(res, { passenger: req.passenger! }, res.t('crud.success'));
    } catch (err) {
      return response.catchError(res, err);
    }
  }
};
