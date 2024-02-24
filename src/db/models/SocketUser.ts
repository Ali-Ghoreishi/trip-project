import { Schema, model, Types } from 'mongoose';

import { IUser } from './User';
import { IPassenger } from './Passenger';
import { IDriver } from './Driver';
import { ICity } from './City';

export enum SocketUserTypeEnum {
  driver = 'driver',
  passenger = 'passenger'
}

export interface ISocketData {
  source: ICity;
  destination: ICity;
  fare: number;
  description: string;
}

export interface ISocketUserInput {
  ID?: string;
  driver_id: ObjectId_ | IDriver;
  passenger_id: ObjectId_ | IPassenger;
  userType: SocketUserTypeEnum;
  socket_id: string;
  socketData: ISocketData[];
}

export interface ISocketUser extends ISocketUserInput {
  _id: Types.ObjectId;
  createdAt: number;
  updatedAt: number;

  // custom property - not exist in the schema
  isModified: any;
  toJSON: any;
}

//* Mongoose Schema
const socketUserSchema = new Schema<ISocketUser>(
  {
    ID: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true,
      index: true
    },
    driver_id: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
      index: true
    },
    passenger_id: {
      type: Schema.Types.ObjectId,
      ref: 'Passenger',
      default: null,
      index: true
    },
    userType: {
      type: String,
      enum: SocketUserTypeEnum,
      required: true,
      index: true
    },
    socket_id: {
      type: String,
      maxlength: 255,
      index: true
    },
    socketData: {
      type: [Object],
      default: []
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
    collection: 'SocketUsers'
  }
);

//* Mongoose.Pre

const SocketUser = model<ISocketUser>('SocketUser', socketUserSchema);
export default SocketUser;
