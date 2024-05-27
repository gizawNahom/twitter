import Context from '../../src/context';
import { Chat } from '../../src/core/entities/chat';
import {
  GetChatsResponse,
  GetChatsUseCase,
} from '../../src/core/useCases/getChatsUseCase';
import { ChatId } from '../../src/core/valueObjects/chatId';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import {
  sampleLimit,
  sampleOffset,
  sampleUser1,
  sampleUser2,
  sampleUserToken,
} from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidLimit,
  testWithInvalidOffset,
  testWithInvalidToken,
} from '../utilities/tests';

function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
  offsetValue = sampleOffset,
}: {
  tokenString?: string;
  limitValue?: number;
  offsetValue?: number;
}): Promise<GetChatsResponse> {
  return new GetChatsUseCase(
    Context.messageGateway,
    Context.gateKeeper,
    Context.logger
  ).execute({
    tokenString,
    limitValue,
    offsetValue,
  });
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  Context.messageGateway = new MessageGatewaySpy();
});

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));

testUserExtractionFailure(() => executeUseCase({}));

test('gets chat list', async () => {
  const msgGateway = Context.messageGateway as MessageGatewaySpy;
  const sampleChat = new Chat(
    new ChatId('globallyUniqueId'),
    [DefaultGateKeeper.defaultUser, sampleUser2],
    new Date(2019)
  );
  msgGateway.getChatsResponse = [sampleChat];

  const response = await executeUseCase({});

  assertCorrectResponse(response);
  assertGetChatCall();

  function assertCorrectResponse(response) {
    const chats = response.chats;
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

  function assertGetChatCall() {
    const getChatsCalls = msgGateway.getChatsCalls;
    expect(getChatsCalls).toHaveLength(1);
    expect(getChatsCalls[0].userId).toBe(DefaultGateKeeper.defaultUser.getId());
    expect(getChatsCalls[0].limit.getLimit()).toBe(sampleLimit);
    expect(getChatsCalls[0].offset.getOffset()).toBe(sampleOffset);
  }
});
