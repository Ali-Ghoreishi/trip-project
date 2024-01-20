import bcrypt from 'bcrypt';
import { Schema, model, Types } from 'mongoose';

import { StatusEnum } from '../../types/custom/enum';
import { IUser } from './User';
import { IDriver } from './Driver';

// export enum CarColorEnum {
//   red = ''
// }

export interface ICarInput {
  ID: string;
  driver_id: Types.ObjectId | IDriver;
  service_id: Types.ObjectId; // | IService;
  model: string;
  chassis_number: string;
  color: string;
  year: number;
  plaque: {
    part1: string;
    part2: string;
  };
  photo_url: string;
  description: string;
  extraData: {
    creator_id: Types.ObjectId | IUser;
    updater_id: Types.ObjectId | IUser;
    remover_id: Types.ObjectId | IUser;
    deletedAt: number;
  };
  status: Status_;
}

export interface ICar extends ICarInput {
  _id: Types.ObjectId;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;

  // custom property - not exist in the schema
  isModified: any;
  toJSON: any;
}

//* Mongoose Schema
const carSchema = new Schema<ICar>(
  {
    ID: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true,
      required: true
    },
    driver_id: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      default: null
    },
    model: {
      type: String,
      trim: true,
      maxlength: 255,
      required: true
    },
    chassis_number: {
      type: String,
      maxlength: 255,
      required: true
    },
    color: {
      type: String,
      trim: true,
      maxlength: 255,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    plaque: {
      part1: {
        type: String,
        maxlength: 6,
        trim: true,
        required: true
      },
      part2: {
        type: String,
        maxlength: 2,
        trim: true,
        required: true
      }
    },
    photo_url: {
      type: String,
      maxlength: 500,
      default: null
    },
    description: {
      type: String,
      maxlength: 500,
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
      enum: StatusEnum,
      default: StatusEnum.deactive
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
    collection: 'Users'
  }
);

//* Mongoose.Pre

//* Index

const Car = model<ICar>('Car', carSchema);
export default Car;
