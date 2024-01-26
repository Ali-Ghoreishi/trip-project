import bcrypt from 'bcrypt';
import { Schema, model, Types } from 'mongoose';

import { StatusEnum } from '../../types/custom/enum';
import { IUser } from './User';

export interface IPassengerInput {
  ID?: string;
  username: string;
  password: string;
  fullname: string;
  email: string;
  mobile: string;
  photo_url: string;
  description: string;
  location?: Location_;
  locationUpdatedAt?: number;
  phoneData?: {
    model: string;
    ip: string;
  };
  extraData?: {
    // creator_id: Types.ObjectId | IUser;
    updater_id: Types.ObjectId | IUser;
    remover_id: Types.ObjectId | IUser;
    deletedAt: number;
  };
  status: Status_;
}

export interface IPassenger extends IPassengerInput {
  _id: Types.ObjectId;
  credit: number;
  fcmToken: string;
  deleted: boolean;
  lastLoginAt: number;
  createdAt: number;
  updatedAt: number;

  // custom property - not exist in the schema
  isModified: any;
  toJSON: any;
}

//* Mongoose Schema
const passengerSchema = new Schema<IPassenger>(
  {
    ID: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      maxlength: 255,
      required: true
    },
    fullname: {
      type: String,
      trim: true,
      maxlength: 255,
      required: true
    },
    email: {
      type: String,
      email: true,
      maxlength: 255,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'wrong email format'],
      default: null
    },
    mobile: {
      type: String,
      maxlength: 11,
      required: true
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
    location: {
      type: Object,
      maxlength: 255,
      default: null
    },
    locationUpdatedAt: {
      type: Number,
      default: null
    },
    phoneData: {
      model: {
        type: String,
        default: null
      },
      ip: {
        type: String,
        default: null
      }
    },
    credit: {
      type: Number,
      default: 0
    },
    fcmToken: {
      type: String,
      default: null
    },
    extraData: {
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
      default: StatusEnum.active
    },
    deleted: {
      type: Boolean,
      default: false
    },
    lastLoginAt: {
      type: Number,
      default: null
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
    collection: 'Passengers'
  }
);

//* Mongoose.Pre
passengerSchema.pre('save', async function (next: any) {
  try {
    let passenger = this;
    const password = passenger.password;
    if (!passenger.isModified('password')) return next();
    const hash = await bcrypt.hash(password, 10);
    passenger.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

//* Index
passengerSchema.index({ location: '2dsphere' });

const Passenger = model<IPassenger>('Passenger', passengerSchema);
export default Passenger;
