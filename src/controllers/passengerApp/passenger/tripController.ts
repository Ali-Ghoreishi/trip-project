import { validate as inputValidate } from 'class-validator';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';
import { StatusEnum } from '../../../types/custom/enum';
import { findAndUpdatePassenger, findPassenger } from '../../../services/passenger';
import { Register_validator } from '../../../components/classValidator/passenger/trip';
import Helper from '../../../components/helper';
import { ITrip, ITripInput, TripStatusEnum } from '../../../db/models/Trip';
import { createTrip, findTrips } from '../../../services/trip';
import mongoose from 'mongoose';
import { IPassenger } from '../../../db/models/Passenger';
import { exRedis } from '../../../components/redis/index';
import { findCity } from '../../../services/city';
import { findService } from '../../../services/service';

const redis_trip = new exRedis('trip', process.env.TRIP_EXPIRE);

export const TripController = {
  register: async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const input = new Register_validator();
      Object.assign(input, req.body);
      const inputValidateErrors = await inputValidate(input);
      if (inputValidateErrors.length > 0) {
        await session.abortTransaction();
        return response.validation(res, inputValidateErrors);
      }

      let passenger = req.passenger!;
      const trips = await findTrips({
        passenger_id: passenger._id,
        status: {
          $in: [TripStatusEnum.findDriver, TripStatusEnum.driverFound, TripStatusEnum.traveling]
        }
      });
      if (trips.count > 0) {
        await session.abortTransaction();
        return response.customError(res, res.t('passenger.youCurrentlyHaveActiveTrip'), 400);
      }
      const service = await findService({ _id: input.service, deleted: false });
      const source = await findCity({ _id: input.source, deleted: false });
      const destination = await findCity({ _id: input.destination, deleted: false });
      if (!service) {
        await session.abortTransaction();
        return response.customError(res, res.t('crud.notFound', { name: res.t('field.service') }), 404);
      }
      if (!source) {
        await session.abortTransaction();
        return response.customError(res, res.t('crud.notFound', { name: res.t('field.source') }), 404);
      }
      if (!destination) {
        await session.abortTransaction();
        return response.customError(res, res.t('crud.notFound', { name: res.t('field.destination') }), 404);
      }
      const fare = await Helper.Trip_CalculateFare(input.source, input.destination);
      if (fare > passenger.credit) {
        await session.abortTransaction();
        return response.customError(res, res.t('passenger.notEnoughCreditToRegisterTrip'), 400);
      }
      const creationData: ITripInput = {
        ...input,
        passenger_id: passenger._id,
        status: TripStatusEnum.findDriver,
        price: fare
      };
      passenger = (await findAndUpdatePassenger(
        { _id: passenger._id },
        { $inc: { credit: -fare, deposit: fare } },
        { session, new: true }
      )) as IPassenger;
      const trip = await createTrip(creationData, { session });
      await redis_trip.Set(`${passenger._id}-trip`, trip);
      await session.commitTransaction();
      return response.success(res, {}, res.t('crud.success'));
    } catch (err) {
      await session.abortTransaction();
      return response.catchError(res, err);
    } finally {
      session.endSession();
    }
  }
};
