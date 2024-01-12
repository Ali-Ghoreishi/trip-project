declare module '*'; // to fix ts(7016) error
import express, { Application, Request, Response, NextFunction } from 'express';

declare global {
  interface Error_ extends Error {
    status?: number; 
  }
  interface IErrorObject_ {
    details: Array<any>;
  }
  type Location_ = {
    type: 'Point';
    coordinates: [number, number];
  };
  type YesNo_ = 'yes' | 'no';
  type Status_ = 'active' | 'deactive' | 'blocked';
  type ListResult_ = {
    count: number;
    data: Array<any>;
  };
}
