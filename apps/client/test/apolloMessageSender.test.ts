import { setUpApi } from '../__tests__/testUtilities';
import { SignedInUser } from '../lib/auth/authContext';
import { DI } from '../lib/auth/DI';
import { AuthGateway } from '../lib/auth/getLoggedInUserUseCase';
import { Message } from '../lib/messages/core/domain/message';
import { ApolloMessageSender } from '../lib/messages/data-source-apollo/apolloMessageSender';
import { READ_MESSAGES_QUERY } from '../lib/messages/data-source-apollo/apolloMessagesUpdated';
import { Client } from '../utilities/client';

setUpApi();

test('returns sent message', async () => {
  const chatId = 'chatId1';
  const text = 'sample';
  const authStub = new AuthGatewayStub();
  DI.authGateway = authStub;
  const senderId = authStub.loggedInUserId;
  const sender = new ApolloMessageSender(Client.client);
  await sender.sendMessage(senderId, text, chatId);

  const messages = readCache(chatId).messages as Message[];
  expect(messages).toHaveLength(1);
  assertSentMessage(messages[0], {
    text,
    chatId,
    isLoading: false,
    senderId,
    createdAt: new Date().toISOString(),
  });
});

test('creates optimistic response', async () => {
  const chatId = 'chatId1';
  const text = 'sample';
  const authStub = new AuthGatewayStub();
  DI.authGateway = authStub;
  const senderId = authStub.loggedInUserId;

  const sender = new ApolloMessageSender(Client.client);
  const responsePromise = sender.sendMessage(senderId, text, chatId);

  const messages = readCache(chatId).messages as Message[];
  await responsePromise;
  expect(messages).toHaveLength(1);
  assertSentMessage(messages[0], {
    text,
    chatId,
    isLoading: true,
    senderId,
    createdAt: new Date().toISOString(),
  });
});

function assertSentMessage(message: Message, obj: Partial<Message>) {
  expect(message.text).toBe(obj.text);
  expect(message.chatId).toBe(obj.chatId);
  expect(message.isLoading).toBe(obj.isLoading);
  expect(message.senderId).toBe(obj.senderId);
  expect(removeSeconds(message.createdAt)).toBe(
    removeSeconds(obj.createdAt as string)
  );
}

function readCache(chatId: string) {
  return Client.client.readQuery(
    {
      query: READ_MESSAGES_QUERY,
      variables: { chatId },
    },
    true
  );
}

function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
}

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
