import express, { Application, Request, Response, NextFunction } from 'express';
import { IUser } from '../db/models/User';
// import { IPassenger } from '../db/models/Passenger';
// import { ICar } from '../db/models/Car';

declare global {
  namespace Express {
    interface Request {
      driver?: IDriver;
      user?: IUser;
      passenger?: IPassenger;
    }
    interface Response {
      t(text1: string, text2?: object): string;
    }
  }
}
