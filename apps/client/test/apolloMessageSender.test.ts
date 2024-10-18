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

function buildMessage({
  isLoading,
  chatId = 'chatId1',
  text = 'sample',
  senderId = getStubbedAuthGateway().loggedInUserId,
}: {
  isLoading: boolean;
  chatId?: string;
  text?: string;
  senderId?: string;
}) {
  return {
    senderId,
    text,
    chatId,
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

function readMessagesInCache(chatId: string): Message[] {
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

async function assertChatOnlyContainsMessage(
  chatId: string,
  message: {
    senderId: string;
    text: string;
    chatId: string;
    createdAt: string;
    isLoading: boolean;
  }
) {
  const messages = readMessagesInCache(chatId);
  expect(messages).toHaveLength(1);
  assertMessageEquality(messages[0], {
    ...message,
    id: await getSavedMessageId(chatId),
  });
}

async function getSavedMessageId(chatId: string, index = 0) {
  const savedMessage = (await messagesDB.read(chatId))?.at(index);
  const savedId = savedMessage?.id;
  return savedId;
}

function stubLoggedInUserId(senderId: string) {
  const stub = new AuthGatewayStub();
  stub.loggedInUserId = senderId;
  Context.authGateway = stub;
}

setUpApi();

beforeEach(() => {
  idGenerator = new IdGeneratorStub();
  msgsContext.idGenerator = idGenerator;
  messagesDB.clear();
});

test('saves correct message', async () => {
  const expectedMessage = buildMessage({ isLoading: false });

  await sendMessage(
    expectedMessage.senderId,
    expectedMessage.text,
    expectedMessage.chatId
  );

  const messagesInCache = readMessagesInCache(expectedMessage.chatId);
  const messagesInServer = await messagesDB.read(expectedMessage.chatId);
  expect(messagesInCache).toHaveLength(1);
  expect(messagesInServer).toHaveLength(1);
  assertMessageEquality(messagesInCache[0], {
    ...expectedMessage,
    id: messagesInServer?.at(0)?.id,
  });
});

test('returns correct message', async () => {
  const expectedMessage = buildMessage({ isLoading: false });

  const message = await sendMessage(
    expectedMessage.senderId,
    expectedMessage.text,
    expectedMessage.chatId
  );

  assertMessageEquality(message, {
    ...expectedMessage,
    id: await getSavedMessageId(expectedMessage.chatId),
  });
});

test('creates optimistic response', async () => {
  const expectedMessage = buildMessage({ isLoading: true });

  const responsePromise = sendMessage(
    expectedMessage.senderId,
    expectedMessage.text,
    expectedMessage.chatId
  );

  const messages = readMessagesInCache(expectedMessage.chatId);
  await responsePromise;
  expect(messages).toHaveLength(1);
  assertMessageEquality(messages[0], {
    ...expectedMessage,
    id: idGenerator.id,
  });
});

test('creates separate message lists for different chats', async () => {
  const message1 = buildMessage({ isLoading: false, chatId: 'chatId1' });
  const message2 = buildMessage({ isLoading: false, chatId: 'chatId2' });

  await sendMessage(message1.senderId, message1.text, message1.chatId);
  await sendMessage(message2.senderId, message2.text, message2.chatId);

  await assertChatOnlyContainsMessage(message1.chatId, message1);
  await assertChatOnlyContainsMessage(message2.chatId, message2);
});

test(`appends message if it has the same chat id`, async () => {
  const chatId = 'chatId1';
  const message1 = buildMessage({
    isLoading: false,
    chatId: chatId,
    text: 'text1',
    senderId: 'senderId1',
  });
  const message2 = buildMessage({
    isLoading: false,
    chatId: chatId,
    text: 'text2',
    senderId: 'senderId2',
  });

  stubLoggedInUserId(message1.senderId);
  await sendMessage(message1.senderId, message1.text, message1.chatId);
  stubLoggedInUserId(message2.senderId);
  await sendMessage(message2.senderId, message2.text, message2.chatId);

  const messages = readMessagesInCache(chatId);
  expect(messages).toHaveLength(2);
  assertMessageEquality(messages[0], {
    ...message1,
    id: await getSavedMessageId(chatId, 0),
  });
  assertMessageEquality(messages[1], {
    ...message2,
    id: await getSavedMessageId(chatId, 1),
  });
});

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
