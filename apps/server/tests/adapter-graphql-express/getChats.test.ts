import Context from '../../src/adapter-api-express/context';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { ChatMother } from '../utilities/ChatMother';
import { sendRequest } from '../utilities/helpers';
import {
  sampleLimit,
  sampleOffset,
  sampleUser2,
  sampleUserToken,
} from '../utilities/samples';

async function sendGetChatsRequest(
  token: string,
  limit: number,
  offset: number
) {
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
  const variables = { token, limit, offset };

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

  const res = await sendGetChatsRequest(
    sampleUserToken,
    sampleLimit,
    sampleOffset
  );

  expect(res.status).toBe(200);
  const chats = res.body.data.chats;
  assertCorrectResponse(chats);

  function assertCorrectResponse(chats) {
    expect(chats).toHaveLength(1);
    expect(chats[0].id).toEqual(sampleChat.getId());
    expect(chats[0].createdAtISO).toEqual(
      sampleChat.getCreatedAt().toISOString()
    );
    expect(chats[0].participant).toStrictEqual({
      username: sampleUser2.getUsername(),
      displayName: sampleUser2.getDisplayName(),
      profilePic: sampleUser2.getProfilePic(),
    });
  }
});
