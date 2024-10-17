import { setUpApi } from '../__tests__/testUtilities';
import { SignedInUser } from '../lib/auth/authContext';
import { DI } from '../lib/auth/DI';
import { DI as msgsDI } from '../lib/messages/DI';
import { AuthGateway } from '../lib/auth/getLoggedInUserUseCase';
import { Message } from '../lib/messages/core/domain/message';
import { READ_MESSAGES_QUERY } from '../lib/messages/data-source-apollo/apolloMessagesUpdated';
import { Client } from '../utilities/client';

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
  DI.authGateway = authStub;
  return authStub;
}

async function sendMessage(senderId: string, text: string, chatId: string) {
  const sender = msgsDI.messageSender;
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

test('returns sent message', async () => {
  const expectedMessage = buildExpectedMessage(false);

  await sendMessage(
    expectedMessage.senderId,
    expectedMessage.text,
    expectedMessage.chatId
  );

  const messages = readMessages(expectedMessage.chatId);
  expect(messages).toHaveLength(1);
  assertMessageEquality(messages[0], expectedMessage);
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
  assertMessageEquality(messages[0], expectedMessage);
});

test.todo(`creates optimistic message`);
test.todo(`only adds message to its chat`);

class AuthGatewayStub implements AuthGateway {
  loggedInUserId = 'senderId';

  getLoggedInUser(): SignedInUser {
    return {
      id: this.loggedInUserId,
    };
  }
}
