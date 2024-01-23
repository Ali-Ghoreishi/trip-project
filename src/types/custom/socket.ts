import { IUser } from '../../db/models/User';

export enum SocketEventEnum {
  connection = 'connection',
  login = 'login'
}

export interface ISocketLoginInput {
    
}

export interface ISocketLoginOutput {
  message: string;
  userEmail: string;
  socketId: string;
}
