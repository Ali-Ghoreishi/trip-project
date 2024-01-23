import { Socket } from './socket';

import { server } from '../app';
import { SocketEventEnum as Event, ISocketLoginInput, ISocketLoginOutput } from '../types/custom/socket';

export const initSocket = async () => {
  const socketService = await Socket.getInstance(server);
  const io = socketService.getIO();

  io.on(Event.connection, (socket) => {
    const socketId = socket.id;
    socket.on(Event.login, async (data: ISocketLoginInput) => {
      console.log(typeof data);
      console.log(data);
      const outputData: ISocketLoginOutput = {
        message: '<<< Login Success >>>',
        userEmail: 'user@gmail.com',
        socketId: socketId
      };
      io.to(socketId).emit(Event.login, outputData);
    });
  });
};
