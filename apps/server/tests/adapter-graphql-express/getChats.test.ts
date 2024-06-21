import Context from '../../src/adapter-api-express/context';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { ChatMother } from '../utilities/ChatMother';
import { assertSingleChatResponse } from '../utilities/assertions';
import { sendRequest } from '../utilities/helpers';
import { sampleLimit, sampleOffset } from '../utilities/samples';

let messageGatewaySpy: MessageGatewaySpy;

async function sendGetChatsRequest(limit: number, offset: number) {
  const query = `query GetChats($limit: Int!, $offset: Int!) {
    chats(limit: $limit, offset: $offset) {
      id
      createdAtISO
      participant {
        username
        displayName
        profilePic
      }
    }
  }`;
  const variables = { limit, offset };

  return await sendRequest(query, variables);
}

beforeEach(() => {
  messageGatewaySpy = new MessageGatewaySpy();
  Context.messageGateway = messageGatewaySpy;
});

test('returns correct response', async () => {
  const sampleChat = ChatMother.chat().build();
  messageGatewaySpy.getChatsResponse = [sampleChat];

  const res = await sendGetChatsRequest(sampleLimit, sampleOffset);

  expect(res.status).toBe(200);
  assertSingleChatResponse(res.body.data.chats, sampleChat);
});
