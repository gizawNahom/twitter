import http from 'http';
import { app } from './app';

export function runServer() {
  const port = process.env.PORT || 3333;
  const server = http.createServer(app);

  server.on('error', console.error);
  return server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });
}
