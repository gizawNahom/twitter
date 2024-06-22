import { Server } from 'http';
import Context from '../../src/adapter-api-express/context';
import { createServer } from '../../src/adapter-api-express/server';
import { Socket, io } from 'socket.io-client';
import { GateKeeperFailureStub } from '../doubles/gateKeeperFailureStub';
import { GateKeeperErrorStub } from '../doubles/gateKeeperErrorStub';
import { ERROR_GENERIC, ERROR_INVALID_USER } from '../utilities/errorMessages';
import { getRandomPort } from '../utilities/helpers';
import { testWithExpectedError } from '../utilities/tests';

const port = getRandomPort();
let server: Server, clientSocket: Socket;

async function connectToServer() {
  return new Promise<{ connected: boolean; error: Error | null }>(
    (resolve, reject) => {
      clientSocket = io(`http://localhost:${port}`, {
        reconnectionDelay: 0,
        forceNew: true,
        extraHeaders: {
          authorization: 'Bearer userToken',
        },
      });

      clientSocket.on('connect', () => {
        resolve({ connected: true, error: null });
      });

      clientSocket.on('connect_error', (error) => {
        resolve({ connected: false, error });
      });

      setTimeout(() => {
        reject(new Error('Failed to connect within 5 seconds.'));
      }, 5000);
    }
  );
}

beforeAll(() => {
  server = createServer().listen(port);
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  clientSocket.disconnect();
});

test('allows user to connect', async () => {
  const { connected } = await connectToServer();

  expect(connected).toBe(true);
}, 10000);

testWithExpectedError(
  async () => {
    Context.gateKeeper = new GateKeeperFailureStub();

    return await connectToServer();
  },
  {
    errorExpectation: ({ error }) => {
      expect(error?.message).toBe(ERROR_INVALID_USER);
    },
  }
);

test('does not allow connection if there is an unexpected error', async () => {
  Context.gateKeeper = new GateKeeperErrorStub();

  const { error } = await connectToServer();

  expect(error?.message).toBe(ERROR_GENERIC);
});
