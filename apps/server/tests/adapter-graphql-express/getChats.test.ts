import Context from '../../src/adapter-api-express/context';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { ChatMother } from '../utilities/ChatMother';
import { assertSingleChatResponse } from '../utilities/assertions';
import { sendRequest } from '../utilities/helpers';
import { sampleLimit, sampleOffset, sampleUser2 } from '../utilities/samples';

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
  Context.messageGateway = new MessageGatewaySpy();
});

test('returns correct response', async () => {
  const msgGateway = Context.messageGateway as MessageGatewaySpy;
  const sampleChat = ChatMother.chatWithParticipants([
    DefaultGateKeeper.defaultUser,
    sampleUser2,
  ]);
  msgGateway.getChatsResponse = [sampleChat];

  const res = await sendGetChatsRequest(sampleLimit, sampleOffset);

  expect(res.status).toBe(200);
  assertSingleChatResponse(res.body.data.chats, sampleChat);
});
