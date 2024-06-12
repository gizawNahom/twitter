import http from 'http';
// import { Server, Socket } from 'socket.io';
import { app } from './app';

export function runServer() {
  const port = process.env.PORT || 3333;
  const server = http.createServer(app);
  // const io = new Server(server);

  // io.on('connection', (socket: Socket) => {
  //   console.log('a user connected');
  //   console.log(socket.request.headers.authorization);

  //   socket.on('send message', () => {
  //     socket.emit('message sent', { message: 'hello' });
  //   });
  // });
  server.on('error', console.error);
  return server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
}

export function createServer(): http.Server {
  const server = http.createServer(app);
  // const io = new Server(server);

  // io.on('connection', (socket: Socket) => {
  //   console.log('a user connected');
  //   console.log(socket.request.headers.authorization);
  // });
  server.on('error', console.error);
  return server;
}
