import { Socket } from 'socket.io';
import { Connection } from '../core/entities/connection';

export class SocketIOConnection extends Connection {
  constructor(private socket: Socket) {
    super();
  }

  emit(eventName: string, obj: unknown) {
    this.socket.emit(eventName, obj);
  }
}
