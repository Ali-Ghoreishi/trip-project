import joi from 'joi';
import { Request, Response } from 'express';

import response from '../../../components/responseHandler';

export const CarController = {
//   registerByDriver: async (req: Request, res: Response) => {
//     try {
//       const input = new LoginByMobileSendCode_validator();
//       Object.assign(input, req.body);
//       const inputValidateErrors = await inputValidate(input);
//       if (inputValidateErrors.length > 0) return response.validation(res, inputValidateErrors);
//       if (input.mobile.length === 10) input.mobile = `0${input.mobile}`;
//       const driver = await findDriver({ mobile: input.mobile });
//       if (!driver) return response.customError(res, res.t('crud.notFound', { name: res.t('field.driver') }), 404);
//       if (driver.status !== StatusEnum.active) {
//         if (driver.status === StatusEnum.deactive) return response.customError(res, res.t('auth.deactive'), 403);
//         if (driver.status === StatusEnum.blocked) return response.customError(res, res.t('auth.blocked'), 403);
//       }
//       if (driver.deleted) return response.customError(res, res.t('statusCode.404'), 404);
//       if (driver.ip) {
//         if (driver.ip !== req.ip) return response.customError(res, res.t('auth.wrong_ip'), 403);
//       }
//       const oldCode = Number(await redis_smsCode.Get(input.mobile));
//       let code: number | string;
//       if (oldCode) {
//         return response.customError(res, res.t('text.2minLimitSMS'), 429);
//       } else {
//         code = Math.floor(Math.random() * 1000000);
//         code = code.toString().padStart(6, '7');
//       }
//       console.log('@_@ driver verification code is:  ', code, ' @_@');
//       await redis_smsCode.Set(input.mobile, code);
//       // const phoneNumber = '+98' + input.mobile;
//       // sms.sendSms(phoneNumber, SmsTemplate[0], { token: code });
//       return response.success(res, {}, res.t('crud.success'));
//     } catch (err) {
//       return response.catchError(res, err);
//     }
//   }
};
