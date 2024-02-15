import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../components/responseHandler';
import { TransactionStatusEnum, TransactionTypeEnum } from '../../db/models/Transaction';
import Pay from '../../components/pay';
import { exRedis } from '../../components/redis';
import { findTransaction, findAndUpdateTransaction } from '../../services/transaction';
import { findAndUpdatePassenger, findPassenger } from '../../services/passenger';
import { findAndUpdateUser, findUser } from '../../services/user';
import { ITransaction } from '../../db/models/Transaction';
import { Verify_validator } from '../../components/classValidator/common/payment';

const redis = new exRedis('Invoice_', process.env.INVOICE_EXPIRE_AFTER);

export const PaymentController = {
  verify: async (req: Request, res: Response) => {
    try {
      const refLinkPortal = process.env.PORTAL_DEEP_LINK || 'https://portal.com/';
      const refLinkPassengerApp = process.env.PASSENGER_APP_DEEP_LINK || 'https://passengerapp.com/dashboard';

      const input = new Verify_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);

      let invoice = await redis.Get(`Invoice-${input.order_id}`);

      //! check redis
      if (!invoice) {
        const transaction = await findTransaction({ order_id: input.order_id, status: TransactionStatusEnum.unknown });
        if (!transaction) {
          return res.render('paymentResultFailed', {
            status: 'failed',
            refLinkPortal: refLinkPortal,
            refLinkPassengerApp: refLinkPassengerApp
          });
        }

        const transaction_data: ITransaction['transaction_data'] = {
          ...transaction.transaction_data,
          track_id: input.track_id,
          order_id: input.order_id,
          amount: input.amount, // rial
          card_no: input.card_no,
          hashed_card_no: input.hashed_card_no,
          date: input.date
        };
        await findAndUpdateTransaction(
          { order_id: input.order_id },
          {
            transaction_data,
            status: TransactionStatusEnum.failed,
            reason: `پرداخت ناموفق - شماره سفارش ${input.order_id}`
          }
        );

        return res.render('paymentResultFailed', {
          status: 'failed',
          refLinkPortal: refLinkPortal,
          refLinkPassengerApp: refLinkPassengerApp
        });
      }
      //! end of check redis

      const renderFunc = (status: 'success' | 'failed') => {
        let refLink: string = '';
        if (invoice.person_type == 'passenger') refLink = refLinkPassengerApp;
        if (invoice.person_type == 'user') refLink = refLinkPortal;

        if (status === 'success') {
          return res.render('paymentResultSuccess', {
            status: 'success',
            refLink
          });
        } else {
          return res.render('paymentResultFailed', {
            status: 'failed',
            refLink
          });
        }
      };

      const check_transaction = await findTransaction({
        $and: [
          {
            $or: [
              { order_id: input.order_id },
              { 'transaction_data.id': input.id },
              { 'transaction_data.track_id': input.track_id }
            ]
          },
          { status: { $in: [TransactionStatusEnum.failed, TransactionStatusEnum.success] } }
        ]
      });
      if (check_transaction) {
        await redis.Delete(`Invoice-${input.order_id}`);
        return renderFunc('failed');
      }

      const transaction = await findTransaction({
        order_id: input.order_id,
        'transaction_data.id': input.id,
        status: TransactionStatusEnum.unknown
      });
      if (!transaction) {
        await redis.Delete(`Invoice-${input.order_id}`);
        return renderFunc('failed');
      }

      const current_time = Date.now();
      const differenceInMinutes = (current_time - transaction.createdAt!) / (1000 * 60);
      if (differenceInMinutes > 10) {
        // 10 - 15 min
        await findAndUpdateTransaction(
          { _id: transaction._id },
          { status: TransactionStatusEnum.failed, reason: `پرداخت ناموفق - شماره سفارش ${input.order_id}` }
        );
        await redis.Delete(`Invoice-${input.order_id}`);
        return renderFunc('failed');
      }

      const verify_data = await Pay.verify({
        id: input.id,
        order_id: input.order_id
      });
      if (!verify_data || !verify_data.status || verify_data.status !== 200) {
        await findAndUpdateTransaction(
          { _id: transaction._id },
          { status: TransactionStatusEnum.failed, reason: `پرداخت ناموفق - شماره سفارش ${input.order_id}` }
        );
        await redis.Delete(`Invoice-${input.order_id}`);
        return renderFunc('failed');
      }

      const inquiry_data = await Pay.inquiry({
        id: input.id,
        order_id: input.order_id
      });
    //   if (!inquiry_data || !inquiry_data.status || inquiry_data.status !== 200) {
    //     await findAndUpdateTransaction(
    //       { _id: transaction._id },
    //       { status: TransactionStatusEnum.failed, reason: `پرداخت ناموفق - شماره سفارش ${input.order_id}` }
    //     );
    //     await redis.Delete(`Invoice-${input.order_id}`);
    //     return renderFunc('failed');
    //   }

      const inc_credit = Number(verify_data.data.amount / 10); // Rial --> Toman

      if (invoice.person_type === 'passenger') {
        if (invoice.operation === TransactionTypeEnum.chargeCredit) {
          const passenger = await findAndUpdatePassenger({ _id: invoice.person_id }, { $inc: { credit: inc_credit } });
        }
      }

      if (invoice.person_type === 'user') {
        if (invoice.operation === TransactionTypeEnum.chargeCredit) {
          const user = await findAndUpdateUser({ _id: invoice.person_id }, { $inc: { credit: inc_credit } });
        }
      }

      const transaction_data: ITransaction['transaction_data'] = {
        ...transaction.transaction_data,
        status: verify_data.data.status,
        track_id: verify_data.data.track_id,
        id: verify_data.data.id,
        order_id: verify_data.data.order_id,
        amount: verify_data.data.amount,
        date: verify_data.data.date
      };

      await findAndUpdateTransaction(
        { _id: transaction._id },
        {
          status: TransactionStatusEnum.success,
          reason: `پرداخت موفق - شماره سفارش ${verify_data.data.order_id}`,
          // before_amount,
          // after_amount,
          transaction_data,
          payment_data: verify_data.data.payment,
          verify_data: verify_data.data.verify,
          inquiry_data: inquiry_data.data
        }
      );

      await redis.Delete(`Invoice-${input.order_id}`);
      return renderFunc('success');
    } catch (error) {
      return response.catchError(res, error);
    }
  }
};
