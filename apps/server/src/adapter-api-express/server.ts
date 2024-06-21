import http from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { GetOnlineUseCase } from '../core/useCases/getOnlineUseCase';
import Context from './context';
import { SocketIOConnection } from './socketIOConnection';
import { handleError } from './utilities';

export function createServer(): http.Server {
  const server = http.createServer(app);
  const io = new Server(server);

  io.use(async (socket, next) => {
    try {
      await new GetOnlineUseCase(
        Context.messageSender,
        Context.gateKeeper,
        Context.logger
      ).execute({
        tokenString: socket.request.headers.authorization as string,
        connection: new SocketIOConnection(socket),
      });
      next();
    } catch (error) {
      handleError(error, next);
    }
  });
  server.on('error', console.error);
  return server;
}
