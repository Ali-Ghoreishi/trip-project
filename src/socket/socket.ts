import { Server } from 'socket.io';
import http from 'http';

// let io: any;

export class Socket {
  static instance: Socket | null;
  io = null as unknown as Server;
  serviceName: string;
  usersOnline: any;
  messages: any;

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
    this.usersOnline = {};
    this.messages = {};
    return this.io;
  }
  getIO() {
    if (!this.io) {
      throw new Error('***_Socket Error_***:  Socket.io NOT Initialized');
    }
    return this.io;
  }
}
