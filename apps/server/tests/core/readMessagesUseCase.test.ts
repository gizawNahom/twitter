import Context from '../../src/context';
import { ReadMessagesUseCase } from '../../src/core/useCases/readMessagesUseCase';
import { ChatId } from '../../src/core/valueObjects/chatId';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import { ERROR_CHAT_DOES_NOT_EXIST } from '../utilities/errorMessages';
import {
  sampleLimit,
  sampleOffset,
  sampleUserToken,
} from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidChatId,
  testWithInvalidLimit,
  testWithInvalidOffset,
  testWithInvalidToken,
} from '../utilities/tests';

const sampleChatId = 'chatId123';
let messageGatewaySpy: MessageGatewaySpy;

async function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
  offsetValue = sampleOffset,
  chatIdString = sampleChatId,
}: {
  tokenString?: string;
  limitValue?: number;
  offsetValue?: number;
  chatIdString?: string;
}) {
  const uC = new ReadMessagesUseCase(
    Context.messageGateway,
    Context.gateKeeper,
    Context.logger
  );
  return await uC.execute({
    tokenString,
    limitValue,
    offsetValue,
    chatIdString,
  });
}

beforeEach(() => {
  messageGatewaySpy = new MessageGatewaySpy();
  Context.messageGateway = messageGatewaySpy;

  Context.gateKeeper = new DefaultGateKeeper();
});

testWithInvalidToken((token) => executeUseCase({ tokenString: token }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));

testWithInvalidChatId((chatIdString) => executeUseCase({ chatIdString }));

testUserExtractionFailure(() => executeUseCase({}));

test('throws if chat does not exist', async () => {
  messageGatewaySpy.getChatWithIdResponse = null;

  await assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_CHAT_DOES_NOT_EXIST
  );
  assertGetChatWithIdCall(messageGatewaySpy);

  function assertGetChatWithIdCall(messageGatewaySpy) {
    const getChatWithIdCalls = messageGatewaySpy.getChatWithIdCalls;
    expect(getChatWithIdCalls).toHaveLength(1);
    expect(getChatWithIdCalls[0].chatId.getId()).toStrictEqual(sampleChatId);
  }
});
