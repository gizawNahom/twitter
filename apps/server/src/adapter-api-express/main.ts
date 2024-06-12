import { createServer } from './server';

const port = process.env.PORT || 3333;
const server = createServer();
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
