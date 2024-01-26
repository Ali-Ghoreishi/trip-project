import { Schema, model, Types } from 'mongoose';

import { IUser } from './User';

export interface ICityInput {
  ID?: string;
  name: string;
  location: Location_;
  extraData: {
    creator_id: Types.ObjectId | IUser;
    updater_id: Types.ObjectId | IUser;
    remover_id: Types.ObjectId | IUser;
    deletedAt: number;
  };
}

export interface ICity extends ICityInput {
  _id: Types.ObjectId;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;

  // custom property - not exist in the schema
  isModified: any;
  toJSON: any;
}

//* Mongoose Schema
const citySchema = new Schema<ICity>(
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
    location: {
      type: Object,
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
    collection: 'Cities'
  }
);

//* Mongoose.Pre

//* Index
citySchema.index({ location: '2dsphere' });

const City = model<ICity>('City', citySchema);
export default City;
