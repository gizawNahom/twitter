import Context from '../../src/adapter-api-express/context';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { ChatMother } from '../utilities/ChatMother';
import { MessageMother } from '../utilities/MessageMother';
import { buildMessageResponse, sendRequest } from '../utilities/helpers';
import {
  sampleChatId,
  sampleLimit,
  sampleOffset,
  sampleUser2,
} from '../utilities/samples';
import {
  testWithExpectedError,
  testWithUnExpectedError,
} from '../utilities/tests';

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
  expect(res.body.data.messages).toStrictEqual([buildMessageResponse(message)]);
});

testWithExpectedError(async () => {
  return await sendReadMessagesRequest();
});

testWithUnExpectedError(async () => {
  return await sendReadMessagesRequest();
});
