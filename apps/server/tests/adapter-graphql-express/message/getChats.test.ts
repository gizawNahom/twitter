import Context from '../../../src/adapter-api-express/context';
import { GateKeeperErrorStub } from '../../doubles/gateKeeperErrorStub';
import { MessageGatewaySpy } from '../../doubles/messageGatewaySpy';
import { ChatMother } from '../../utilities/ChatMother';
import { assertSingleChatResponse } from '../../utilities/assertions';
import { buildChatResponse, sendRequest } from '../../utilities/helpers';
import {
  sampleLimit,
  sampleOffset,
  sampleUser1,
} from '../../utilities/samples';
import {
  testWithExpectedError,
  testWithUnExpectedError,
} from '../../utilities/tests';

let messageGatewaySpy: MessageGatewaySpy;

async function sendGetChatsRequest() {
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
  const variables = { limit: sampleLimit, offset: sampleOffset };

  return await sendRequest(query, variables);
}

beforeEach(() => {
  messageGatewaySpy = new MessageGatewaySpy();
  Context.messageGateway = messageGatewaySpy;
});

test('returns correct response', async () => {
  const sampleChat = ChatMother.chat()
    .withTheSecondParticipant(sampleUser1)
    .build();
  messageGatewaySpy.getChatsResponse = [sampleChat];

  const res = await sendGetChatsRequest();

  expect(res.status).toBe(200);
  assertSingleChatResponse(
    res.body.data.chats,
    buildChatResponse(sampleChat, 1)
  );
});

testWithExpectedError(async () => {
  return await sendGetChatsRequest();
});

testWithUnExpectedError(async () => {
  Context.gateKeeper = new GateKeeperErrorStub();
  return await sendGetChatsRequest();
});
