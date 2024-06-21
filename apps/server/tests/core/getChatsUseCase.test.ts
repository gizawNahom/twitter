import Context from '../../src/adapter-api-express/context';
import {
  GetChatsResponse,
  GetChatsUseCase,
} from '../../src/core/useCases/getChatsUseCase';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { ChatMother } from '../utilities/ChatMother';
import {
  sampleLimit,
  sampleOffset,
  sampleUser1,
  sampleUserToken,
} from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidLimit,
  testWithInvalidOffset,
  testWithInvalidToken,
} from '../utilities/tests';
import {
  assertSingleChatResponse,
  buildChatResponse,
} from '../utilities/assertions';

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
  const sampleChat = ChatMother.chat()
    .withTheSecondParticipant(sampleUser1)
    .build();
  msgGateway.getChatsResponse = [sampleChat];

  const response = await executeUseCase({});

  assertSingleChatResponse(response.chats, buildChatResponse(sampleChat, 1));
  assertGetChatCall();

  function assertGetChatCall() {
    const getChatsCalls = msgGateway.getChatsCalls;
    expect(getChatsCalls).toHaveLength(1);
    expect(getChatsCalls[0].userId).toBe(DefaultGateKeeper.defaultUser.getId());
    expect(getChatsCalls[0].limit.getLimit()).toBe(sampleLimit);
    expect(getChatsCalls[0].offset.getOffset()).toBe(sampleOffset);
  }
});
