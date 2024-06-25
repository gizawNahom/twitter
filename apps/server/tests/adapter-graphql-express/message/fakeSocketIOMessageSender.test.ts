import { FakeSocketIOMessageSender } from '../../../src/adapter-api-express/fakeSocketIOMessageSender';
import { SocketIOConnection } from '../../../src/adapter-api-express/socketIOConnection';
import { MessageMother } from '../../utilities/MessageMother';
import { sampleUser1, sampleUser2 } from '../../utilities/samples';
import { createServer } from 'node:http';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';
import { Server, type Socket as ServerSocket } from 'socket.io';
import { getRandomPort, removeSeconds } from '../../utilities/helpers';

let sender: FakeSocketIOMessageSender;
let io, serverSocket, clientSocket, httpServer;
const port = getRandomPort();

async function makeCorrespondentAvailable(correspondentId: string) {
  clientSocket = ioc(`http://localhost:${port}`);
  await waitFor(io, 'connection');
  await sender.makeCorrespondentAvailable(
    new SocketIOConnection(serverSocket),
    correspondentId
  );

  function waitFor(socket: ServerSocket | ClientSocket, event: string) {
    return new Promise((resolve) => {
      socket.once(event, resolve);
    });
  }
}

async function isCorrespondentAvailable(
  correspondentId: string
): Promise<boolean> {
  return await sender.isCorrespondentAvailable(correspondentId);
}

beforeAll(() => {
  httpServer = createServer();
  io = new Server(httpServer);
  httpServer.listen(port, () => {
    io.on('connection', (socket) => {
      serverSocket = socket;
    });
  });
});

afterAll(() => {
  io.close();
  httpServer.close();
});

beforeEach(() => {
  sender = new FakeSocketIOMessageSender();
});

afterEach(() => {
  clientSocket.disconnect();
});

test('returns true if a correspondent is available', async () => {
  await makeCorrespondentAvailable(sampleUser1.getId());

  expect(await isCorrespondentAvailable(sampleUser1.getId())).toBe(true);
});

test('returns false if a correspondent is not available', async () => {
  expect(await isCorrespondentAvailable(sampleUser1.getId())).toBe(false);
});

test('returns correct availability status for two correspondents', async () => {
  await makeCorrespondentAvailable(sampleUser1.getId());

  expect(await isCorrespondentAvailable(sampleUser1.getId())).toBe(true);
  expect(await isCorrespondentAvailable(sampleUser2.getId())).toBe(false);
});

test('sends message', async () => {
  await makeCorrespondentAvailable(sampleUser1.getId());
  const message = MessageMother.message();

  await sender.sendMessage(message, sampleUser1.getId());

  const response = await getServerResponse();
  assertCorrectMessage(response.message, message);

  async function getServerResponse() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await new Promise<any>((resolve, reject) => {
      clientSocket.on('message:send', (data) => {
        resolve(data);
      });

      setTimeout(() => {
        reject(new Error('Failed to get response, connection timed out...'));
      }, 5000);
    });
  }

  function assertCorrectMessage(responseMsg, expectedMsg) {
    responseMsg.createdAtISO = removeSeconds(responseMsg.createdAtISO);
    expect(responseMsg).toStrictEqual({
      id: expectedMsg.getId(),
      senderId: expectedMsg.getSenderId(),
      chatId: expectedMsg.getChatId(),
      text: expectedMsg.getText(),
      createdAtISO: removeSeconds(expectedMsg.getCreatedAt().toISOString()),
    });
  }
});
