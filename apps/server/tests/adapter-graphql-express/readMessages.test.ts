import Context from '../../src/adapter-api-express/context';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { ChatMother } from '../utilities/ChatMother';
import { MessageMother } from '../utilities/MessageMother';
import { sendRequest } from '../utilities/helpers';
import {
  sampleChatId,
  sampleLimit,
  sampleOffset,
  sampleUser2,
} from '../utilities/samples';

let messageGatewaySpy: MessageGatewaySpy;

async function sendReadMessagesRequest() {
  const query = `query ReadMessages($limit: Int!, $offset: Int!, $chatId: String!) {
    messages(limit: $limit, offset: $offset, chatId: $chatId) {
      id
      senderId
      chatId
      text
      createdAt
    }
  }`;
  const variables = {
    limit: sampleLimit,
    offset: sampleOffset,
    chatId: sampleChatId,
  };

  return await sendRequest(query, variables);
}

beforeEach(() => {
  messageGatewaySpy = new MessageGatewaySpy();
  Context.messageGateway = messageGatewaySpy;
});

test('returns correct response', async () => {
  const message = MessageMother.message();
  messageGatewaySpy.getMessagesResponse = [message];
  messageGatewaySpy.getChatWithIdResponse = ChatMother.chat()
    .withParticipants([DefaultGateKeeper.defaultUser, sampleUser2])
    .build();

  const res = await sendReadMessagesRequest();

  expect(res.status).toBe(200);
  assertCorrectResponse(res.body.data.messages, {
    id: message.getId(),
    senderId: message.getSenderId(),
    chatId: message.getChatId(),
    text: message.getText(),
    createdAt: message.getCreatedAt().toISOString(),
  });
});

function assertCorrectResponse(messages, message) {
  expect(messages).toStrictEqual([message]);
}
