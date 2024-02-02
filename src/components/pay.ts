import axios, { AxiosResponse } from 'axios';

import Helper from './helper';
import { createTransaction } from '../services/transaction';
import { ITransaction, TransactionStatusEnum, TransactionTypeEnum } from '../db/models/Transaction';
import { IUser } from '../db/models/User';
import { IPassenger } from '../db/models/Passenger';
import { IDriver } from '../db/models/Driver';

type PaymentData = {
  amount: number;
  name: string;
  phone?: string;
  email?: string;
  desc?: string;
  user_id?: ObjectId_ | IUser;
  passenger_id?: ObjectId_ | IPassenger;
  driver_id?: ObjectId_ | IDriver;
  transactionType: TransactionTypeEnum;
  ip: string;
};

const urls = {
  callback: process.env.PAYMENT_CALLBACK_URL,
  payment: 'https://api.idpay.ir/v1.1/payment',
  verify: 'https://api.idpay.ir/v1.1/payment/verify',
  inquiry: 'https://api.idpay.ir/v1.1/payment/inquiry'
};

const Pay = {
  // step 1
  payment: async (payData: PaymentData) => {
    try {
      const order_id = Helper.Gen_OrderID();
      const req_data = {
        name: payData.name,
        order_id,
        amount: payData.amount,
        callback: urls.callback
      };
      // if (payData.phone) req_data.phone = payData.phone;
      // if (payData.email) req_data.mail = payData.mail;
      // if (payData.desc) req_data.desc = payData.desc;

      const req_options = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.PAYMENT_API_KEY,
          'X-SANDBOX': 1 // test mode
        }
      };
      const response = await axios.post(urls.payment, req_data, req_options);

      const transaction_data: ITransaction = {
        reason: '-', // fix me
        order_id: order_id,
        amount: Number(payData.amount / 10), // convert rial to toman
        transaction_data: {
          id: response.data.id,
          link: response.data.link
        },
        type: payData.transactionType,
        status: TransactionStatusEnum.unknown
      };
      if (payData.ip) transaction_data.ip = payData.ip;
      if (payData.user_id) transaction_data.user_id = payData.user_id;
      if (payData.driver_id) transaction_data.driver_id = payData.driver_id;
      if (payData.passenger_id) transaction_data.passenger_id = payData.passenger_id;

      const transaction = await createTransaction(transaction_data);

      const data = {
        response,
        data: {
          id: response.data.id as string,
          link: response.data.link as string,
          order_id,
          amount: payData.amount,
          db_transactionID: transaction._id
        }
      };
      return data;
    } catch (error: any) {
      throw error;
      // console.log('payment - payment error is :  ', { errorMessage: error.message, errorData: error.response.data });
    }
  },

  // step 2
  verify: async (verifyData: any) => {
    try {
      const req_data = {
        id: verifyData.id,
        order_id: verifyData.order_id
      };
      const req_options = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.PAYMENT_API_KEY,
          'X-SANDBOX': 1 // test mode
        }
      };
      const response = await axios.post(urls.verify, req_data, req_options);
      return response;
    } catch (error: any) {
      throw error;
      // console.log('payment - verify error is :   ', { errorMessage: error.message, errorData: error.response.data });
    }
  },

  // step 3 - optional
  inquiry: async (inquiryData: any) => {
    try {
      const req_data = {
        id: inquiryData.id,
        order_id: inquiryData.order_id
      };
      const req_options = {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.PAYMENT_API_KEY,
          'X-SANDBOX': 1 // test mode
        }
      };
      const response = await axios.post(urls.inquiry, req_data, req_options);
      return response;
    } catch (error: any) {
      throw error;
      // console.log('payment - inquiry error is :   ', { errorMessage: error.message, errorData: error.response.data });
    }
  }
};

export default Pay;
