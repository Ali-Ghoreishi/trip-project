import { SocketEventEnum } from '../types/custom/socket';
import { Socket } from './socket';
import { server } from '../app';
import { ISocketData, ISocketUser, SocketUserTypeEnum } from '../db/models/SocketUser';

export const socketEmitter = async (
  event: SocketEventEnum,
  listener_id: ObjectId_,
  listenerType: SocketUserTypeEnum,
  data: ISocketData
) => {
  const socketService = await Socket.getInstance(server);

  const io = socketService.getIO();

  const user = await socketService.isUserOnline(listener_id, listenerType);
  if (user) {
    io.to(user.socket_id).emit(event, { data });
    // console.log(`emit message: ${event} , data: ${data}`);
  }/*  else {
    await socketService.insertData(listener_id, listenerType, data);
  } */
};
