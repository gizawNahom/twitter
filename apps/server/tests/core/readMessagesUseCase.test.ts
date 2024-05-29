import Context from '../../src/context';
import { MessageBuilder } from '../../src/core/messageBuilder';
import { ReadMessagesUseCase } from '../../src/core/useCases/readMessagesUseCase';
import { ChatId } from '../../src/core/valueObjects/chatId';
import { MessageText } from '../../src/core/valueObjects/messageText';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { ChatMother } from '../utilities/ChatMother';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import {
  ERROR_CHAT_DOES_NOT_EXIST,
  ERROR_NOT_PARTICIPANT,
} from '../utilities/errorMessages';
import {
  sampleLimit,
  sampleOffset,
  sampleUser1,
  sampleUser2,
  sampleUserId,
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

test('throws if user is not a participant', async () => {
  messageGatewaySpy.getChatWithIdResponse = ChatMother.chatWithParticipants([
    sampleUser1,
    sampleUser2,
  ]);

  await assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_NOT_PARTICIPANT
  );
});

test('gets messages', async () => {
  const message = MessageBuilder.message()
    .withId('globallyUniqueId')
    .withChatId(new ChatId(sampleChatId))
    .withCreatedAt(new Date(2011))
    .withSenderId(sampleUserId)
    .withText(new MessageText('hello'))
    .build();
  messageGatewaySpy.getMessagesResponse = [message];
  messageGatewaySpy.getChatWithIdResponse = ChatMother.chatWithParticipants([
    DefaultGateKeeper.defaultUser,
    sampleUser2,
  ]);

  const response = await executeUseCase({});

  assertCorrectResponse(response, message);
  assertGetMessageCall();

  function assertGetMessageCall() {
    const getMessagesCalls = messageGatewaySpy.getMessagesCalls;
    expect(getMessagesCalls).toHaveLength(1);
    expect(getMessagesCalls[0].chatId.getId()).toBe(sampleChatId);
    expect(getMessagesCalls[0].limit.getLimit()).toBe(sampleLimit);
    expect(getMessagesCalls[0].offset.getOffset()).toBe(sampleOffset);
  }

  function assertCorrectResponse(response, message) {
    expect(response).toStrictEqual({
      messages: [message],
    });
  }
});
