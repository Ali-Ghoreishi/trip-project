import { Schema, model, Types } from 'mongoose';

import { ICity } from './City';
import { IPassenger } from './Passenger';
import { IDriver } from './Driver';
import { ICar } from './Car';
import { IService } from './Service';

export enum TripStatusEnum {
  findDriver = 'findDriver',
  driverFound = 'driverFound',
  traveling = 'traveling',
  ended = 'ended',
  cancelDriverNotFound = 'cancelDriverNotFound',
  cancelByAdmin = 'cancelByAdmin',
  canceledByPassenger = 'canceledByPassenger',
  canceledByDriver = 'canceledByDriver'
}

export interface ITripInput {
  ID?: string;
  passenger_id: Types.ObjectId | IPassenger;
  service: Types.ObjectId | IService;
  source: Types.ObjectId | ICity;
  destination: Types.ObjectId | ICity;
  price: number;
  status: TripStatusEnum;
  description: string;
}

export interface ITrip extends ITripInput {
  _id: Types.ObjectId;
  driver_id: Types.ObjectId | IDriver;
  car_id: Types.ObjectId | ICar;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;

  // custom property - not exist in the schema
  isModified: any;
  toJSON: any;
}

//* Mongoose Schema
const tripSchema = new Schema<ITrip>(
  {
    ID: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true
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
    car_id: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      default: null
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      default: null
    },
    source: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      default: null
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      default: null
    },
    price: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: TripStatusEnum,
      default: TripStatusEnum.findDriver
    },
    description: {
      type: String,
      maxlength: 500,
      default: null
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
    collection: 'Trips'
  }
);

//* Mongoose.Pre

//* Index

const Trip = model<ITrip>('Trip', tripSchema);
export default Trip;
