import { Schema, model, Types } from 'mongoose';

import { IUser } from './User';

export interface IServiceInput {
  ID?: string;
  name: string;
  capacity: number;
  photo_url: string;
  extraData: {
    creator_id: Types.ObjectId | IUser;
    updater_id: Types.ObjectId | IUser;
    remover_id: Types.ObjectId | IUser;
    deletedAt: number;
  };
}

export interface IService extends IServiceInput {
  _id: Types.ObjectId;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;

  // custom property - not exist in the schema
  isModified: any;
  toJSON: any;
}

//* Mongoose Schema
const serviceSchema = new Schema<IService>(
  {
    ID: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true
    },
    name: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    photo_url: {
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
    collection: 'Services'
  }
);

//* Mongoose.Pre

//* Index

const Service = model<IService>('Service', serviceSchema);
export default Service;
