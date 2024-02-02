import { Schema, model, Types } from 'mongoose';

import { StatusEnum } from '../../types/custom/enum';
import { ITrip } from './Trip';
import { IDriver } from './Driver';
import { IPassenger } from './Passenger';
import { IUser } from './User';

export enum TransactionStatusEnum {
  success = 'success',
  failed = 'failed',
  unknown = 'unknown'
}
export enum TransactionTypeEnum {
  chargeCredit = 'chargeCredit'
}

export interface ITransactionInput {
  ID?: string;
  reason: string; // شرح تراکنش
  user_id?: Types.ObjectId | IUser;
  driver_id?: Types.ObjectId | IDriver;
  passenger_id?: Types.ObjectId | IPassenger;
  trip_id?: Types.ObjectId | ITrip;
  order_id?: string;
  amount: number; // toman
  //   before_amount: number;
  //   after_amount: number;
  transaction_data?: object; // اطلاعات تراکنش  // rial
  payment_data?: object; // اطلاعات پرداخت تراکنش
  verify_data?: object; // اطلاعات تایید تراکنش
  inquiry_data?: object; // اطلاعات استعلام تراکنش
  photo_url?: string;
  type: TransactionTypeEnum; // نوع تراکنش
  ip?: string;
  extraData?: {
    creator_id: Types.ObjectId | IUser;
    updater_id: Types.ObjectId | IUser;
    remover_id: Types.ObjectId | IUser;
    deletedAt: number;
  };
  status: TransactionStatusEnum;
}

export interface ITransaction extends ITransactionInput {
  _id?: Types.ObjectId;
  deleted?: boolean;
  createdAt?: number;
  updatedAt?: number;
  isModified?: any;

  // custom property - not exist in the schema
  toJSON?: any;
}

//* Mongoose Schema
const transactionSchema = new Schema<ITransaction>(
  {
    ID: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true
    },
    reason: {
      type: String,
      maxlength: 255,
      default: null
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    passenger_id: {
      type: Schema.Types.ObjectId,
      ref: 'Passenger',
      default: null
    },
    driver_id: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    trip_id: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      default: null
    },
    order_id: {
      type: String,
      maxlength: 255,
      default: null
    },
    amount: {
      type: Number,
      default: null
    },
    // before_amount: {
    //   type: Number,
    //   default: null
    // },
    // after_amount: {
    //   type: Number,
    //   default: null
    // },
    transaction_data: {
      type: Schema.Types.Mixed,
      default: null
    },
    payment_data: {
      type: Schema.Types.Mixed,
      default: null
    },
    verify_data: {
      type: Schema.Types.Mixed,
      default: null
    },
    inquiry_data: {
      type: Schema.Types.Mixed,
      default: null
    },
    photo_url: {
      type: String,
      maxlength: 500,
      default: null
    },
    type: {
      type: String,
      enum: TransactionTypeEnum,
      default: TransactionTypeEnum.chargeCredit
    },
    ip: {
      type: String,
      maxlength: 255,
      default: null
    },
    extraData: {
      creator_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      updater_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      remover_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      deletedAt: {
        type: Number,
        default: null
      }
    },
    status: {
      type: String,
      enum: TransactionStatusEnum,
      default: TransactionStatusEnum.unknown
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number
    }
  },
  {
    timestamps: true,
    collection: 'Transactions'
  }
);

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
