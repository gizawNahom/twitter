import { setUpApi } from '../__tests__/testUtilities';
import { SignedInUser } from '../lib/auth/authContext';
import { Context } from '../lib/auth/context';
import { Context as msgsContext } from '../lib/messages/context';
import { AuthGateway } from '../lib/auth/getLoggedInUserUseCase';
import { Message } from '../lib/messages/core/domain/message';
import { READ_MESSAGES_QUERY } from '../lib/messages/data-source-apollo/apolloMessagesUpdated';
import { Client } from '../utilities/client';
import { IdGenerator } from '../lib/messages/data-source-apollo/idGenerator';
import messagesDB from './data/messages';

let idGenerator: IdGeneratorStub;

function buildExpectedMessage(isLoading: boolean) {
  return {
    senderId: getStubbedAuthGateway().loggedInUserId,
    text: 'sample',
    chatId: 'chatId1',
    createdAt: new Date().toISOString(),
    isLoading,
  };
}

function getStubbedAuthGateway() {
  const authStub = new AuthGatewayStub();
  Context.authGateway = authStub;
  return authStub;
}

async function sendMessage(senderId: string, text: string, chatId: string) {
  const sender = msgsContext.messageSender;
  return sender.sendMessage(senderId, text, chatId);
}

function readMessages(chatId: string): Message[] {
  return Client.client.readQuery(
    {
      query: READ_MESSAGES_QUERY,
      variables: { chatId },
    },
    true
  ).messages as Message[];
}

function assertMessageEquality(message: Message, obj: Partial<Message>) {
  expect(message.id).toBe(obj.id);
  expect(message.text).toBe(obj.text);
  expect(message.chatId).toBe(obj.chatId);
  expect(message.isLoading).toBe(obj.isLoading);
  expect(message.senderId).toBe(obj.senderId);
  expect(removeSeconds(message.createdAt)).toBe(
    removeSeconds(obj.createdAt as string)
  );
}

function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
}

setUpApi();

beforeEach(() => {
  idGenerator = new IdGeneratorStub();
  msgsContext.idGenerator = idGenerator;
  messagesDB.clear();
});

test('saves correct message', async () => {
  const expectedMessage = buildExpectedMessage(false);

  await sendMessage(
    expectedMessage.senderId,
    expectedMessage.text,
    expectedMessage.chatId
  );

  const messagesInCache = readMessages(expectedMessage.chatId);
  const messagesInServer = await messagesDB.read(expectedMessage.chatId);
  expect(messagesInCache).toHaveLength(1);
  expect(messagesInServer).toHaveLength(1);
  assertMessageEquality(messagesInCache[0], {
    ...expectedMessage,
    id: messagesInServer?.at(0)?.id,
  });
});

test('returns correct message', async () => {
  const expectedMessage = buildExpectedMessage(false);

  const message = await sendMessage(
    expectedMessage.senderId,
    expectedMessage.text,
    expectedMessage.chatId
  );

  const savedMessage = (await messagesDB.read(expectedMessage.chatId))?.at(0);
  assertMessageEquality(message, { ...expectedMessage, id: savedMessage?.id });
});

test('creates optimistic response', async () => {
  const expectedMessage = buildExpectedMessage(true);

  const responsePromise = sendMessage(
    expectedMessage.senderId,
    expectedMessage.text,
    expectedMessage.chatId
  );

  const messages = readMessages(expectedMessage.chatId);
  await responsePromise;
  expect(messages).toHaveLength(1);
  assertMessageEquality(messages[0], {
    ...expectedMessage,
    id: idGenerator.id,
  });
});

test.todo(`only adds message to its chat`);

class AuthGatewayStub implements AuthGateway {
  loggedInUserId = 'senderId';

  getLoggedInUser(): SignedInUser {
    return {
      id: this.loggedInUserId,
    };
  }
}

class IdGeneratorStub implements IdGenerator {
  id = 'sampleId';

  generateId(): string {
    return this.id;
  }
}
