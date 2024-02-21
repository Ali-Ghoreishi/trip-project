import { RabbitMQExchangeNameEnum, RabbitMQRoutingKeyEnum } from './../../types/custom/enum';
import { Request, Response } from 'express';
import { validate as inputValidate } from 'class-validator';
import bcrypt from 'bcrypt';

import response from '../../components/responseHandler';
import { createUser, findUsers } from '../../services/user';
import { AuthHandler } from '../../components/auth';
import { LoginByMobileSendCode_validator } from '../../components/classValidator/portal/auth';
import RabbitMQSetup from '../../components/messageBroker';

const rabbitMQSetup = new RabbitMQSetup();

export const testController = {
  post: async (req: Request, res: Response) => {
    try {
      // Set up RabbitMQ
      const channel = await rabbitMQSetup.setup();
      // Construct the message to be sent
      const message = { id: 1, name: 'New trip registered' };

      // Publish the message to RabbitMQ
      await rabbitMQSetup.sendMessage(undefined, undefined, RabbitMQRoutingKeyEnum.trip_routing_key, message);
      return response.success(res, {}, 'ok');
    } catch (error) {
      return response.catchError(res, error);
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      return response.success(res, {}, 'ok');
    } catch (error) {
      return response.catchError(res, error);
    }
  }
};
