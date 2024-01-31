// const _ = require('lodash');
import _ = require('lodash');
import express, { Application, Request, Response, NextFunction } from 'express';

export default class ResponseHandler {
  static customError(res: Response, message: string, statusCode: number, field?: string, data?: any) {
    return res.status(statusCode).json({
      message,
      field,
      data
    });
  }

  static success(res: Response, data: any, message: string) {
    return res.status(200).json({
      message,
      data
    });
  }

  static validation(res: Response, errors: any[], field = 'all') {
    const [firstKey, firstValue] = Object.entries(errors[0].constraints)[0];
    let message = res.t(`classValidator.${firstKey}`, { name: res.t(`field.${errors[0].property}`) });
    const errorKeyArray = ['cvLength', 'minLength', 'maxLength', 'min', 'max'];
    if (errorKeyArray.includes(firstKey)) {
      message = res.t(`classValidator.${firstKey}`, { name: res.t(`field.${errors[0].property}`), value: firstValue });
    } else if (firstKey === 'isIn') {
      const colonIndex = (firstValue as string).indexOf(':');
      const value = (firstValue as string).slice(colonIndex + 1).trim();
      message = res.t(`classValidator.${firstKey}`, { value: value });
    }
    return res.status(400).json({
      message: message,
      field: errors[0].property
    });
  }

  static catchError(res: Response, err: any) {
    if (err.name === 'CustomError') {
      return ResponseHandler.customError(res, err.message, err.status, '-', err.Data || []);
    } else {
      ResponseHandler.customError(res, res.t('statusCode.500'), 500, '-', []);
      throw err;
    }
  }
}
