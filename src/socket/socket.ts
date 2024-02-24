import { Server } from 'socket.io';
import http from 'http';
import { ICity } from '../db/models/City';
import {
  createSocketUser,
  deleteSocketUser,
  findAndUpdateSocketUser,
  findSocketUser,
  findSocketUsers
} from '../services/socketUser';
import { ISocketData, ISocketUser, ISocketUserInput, SocketUserTypeEnum } from '../db/models/SocketUser';

export class Socket {
  static instance: Socket | null;
  io = null as unknown as Server;
  serviceName: string;

  constructor() {
    this.serviceName = 'SOCKET_SERVICE';
  }

  static async getInstance(httpServer: http.Server) {
    if (!Socket.instance) {
      try {
        Socket.instance = new Socket();
        await Socket.instance.init(httpServer);
      } catch (err) {
        Socket.instance = null;
        console.warn('***_Socket Error_***:  Can not init Socket');
        throw new Error('***_Socket Error_***:  Can not init Socket');
      }
    }
    return Socket.instance;
  }

  async init(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      pingTimeout: 2000000,
      pingInterval: 50000,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    return this.io;
  }

  getIO() {
    if (!this.io) {
      throw new Error('***_Socket Error_***:  Socket.io NOT Initialized');
    }
    return this.io;
  }

  async insertOnlineUser(user: ISocketUserInput) {
    let user_ = null;
    if (user.userType === 'driver') user_ = await findSocketUser({ driver_id: user.driver_id }, 'ID');
    if (user.userType === 'passenger') user_ = await findSocketUser({ passenger_id: user.passenger_id }, 'ID');
    if (!user) await createSocketUser(user);
    return;
  }

  // async insertData(user_id: ObjectId_, userType: SocketUserTypeEnum, data: ISocketData) {
  //   if (userType === 'driver') await findAndUpdateSocketUser({ driver_id: user_id }, { $push: { socketData: data } });
  //   if (userType === 'passenger')
  //     await findAndUpdateSocketUser({ passenger_id: user_id }, { $push: { socketData: data } });
  // }

  // async getData(user_id: ObjectId_, userType: SocketUserTypeEnum) {
  //   if (userType === 'driver') return await findSocketUser({ driver_id: user_id }, 'socketData');
  //   if (userType === 'passenger') return await findSocketUser({ passenger_id: user_id }, 'socketData');
  // }

  async getOnlineUsers() {
    return await findSocketUsers();
  }

  async isUserOnline(user_id: ObjectId_, userType: SocketUserTypeEnum) {
    if (userType === 'driver') return await findSocketUser({ driver_id: user_id });
    if (userType === 'passenger') return await findSocketUser({ passenger_id: user_id });
  }

  async deleteOnlineUser(user_id: ObjectId_, userType: SocketUserTypeEnum) {
    if (userType === 'driver') await deleteSocketUser({ driver_id: user_id });
    if (userType === 'passenger') await deleteSocketUser({ passenger_id: user_id });
    return;
  }
}
