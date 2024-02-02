import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import { StatusEnum } from '../../../types/custom/enum';
import { findPassenger } from '../../../services/passenger';
import { Charge_validator } from '../../../components/classValidator/passenger/credit';
import Pay from '../../../components/pay';
import { TransactionTypeEnum } from '../../../db/models/Transaction';
import { exRedis } from '../../../components/redis';

const redis = new exRedis('Invoice_', process.env.INVOICE_EXPIRE_AFTER);

export const CreditController = {
  charge: async (req: Request, res: Response) => {
    try {
      const input = new Charge_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
      const passenger = req.passenger!
      input.amount = input.amount * 10; // Toman --> Rial

      const payment_data = await Pay.payment({
        amount: input.amount,
        name: passenger!.fullname,
        ip: req.ip!,
        passenger_id: passenger!._id,
        transactionType: TransactionTypeEnum.chargeCredit
      });
      if (!payment_data || !payment_data.response || payment_data.response.status !== 201)
        return response.customError(res, res.t('statusCode.500'), 500);
      if (payment_data.response.status === 201) {
        const redis_data = await redis.Set(`Invoice-${payment_data.data.order_id}`, {
          ...payment_data.data,
          person_id: passenger!._id,
          person_type: 'passenger',
          operation: TransactionTypeEnum.chargeCredit
        });
        return response.success(res, { link: payment_data.data.link }, res.t('CRUD.Success'));
      }
    } catch (error) {
      return response.catchError(res, error);
    }
  }
};
