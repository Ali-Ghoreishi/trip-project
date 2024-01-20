import bcrypt from 'bcrypt'
import { Schema, model, Types } from 'mongoose';

import { StatusEnum } from '../../types/custom/enum';


export interface IUserInput {
  ID: string;
  username: string;
  password: string;
  fullname: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
  ip: string;
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

export interface IUser extends IUserInput {
  _id: Types.ObjectId;
  credit: number;
  fcmToken: string;
  deleted: boolean;
  lastLoginAt: number
  createdAt: number;
  updatedAt: number;

  // custom property - not exist in the schema
  isModified: any;
  toJSON: any;
}

//* Mongoose Schema
const userSchema = new Schema<IUser>(
  {
    ID: {
      type: String,
      trim: true,
      maxlength: 255,
      unique: true,
      required: true
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
    address: {
      type: String,
      maxlength: 255,
      default: null
    },
    role: {
      type: String,
      maxlength: 255,
      required: true
    },
    ip: {
      type: String,
      maxlength: 255,
      default: null
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
    credit: {
      type: Number,
      default: 0
    },
    fcmToken: {
      type: String,
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
    collection: 'Users'
  }
);

//* Mongoose.Pre
userSchema.pre('save', async function (next: any) {
  try {
    let user = this
    const password = user.password;
    if (!user.isModified('password')) return next();
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

//* Index


const User = model<IUser>('User', userSchema);
export default User;
