import Context from '../../src/adapter-api-express/context';
import { Message } from '../../src/core/entities/message';
import {
  SendMessageRequest,
  SendMessageResponse,
  SendMessageUseCase,
} from '../../src/core/useCases/sendMessageUseCase';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { DummyUserRepository } from '../../src/adapter-api-express/dummyUserRepository';
import { IdGeneratorStub } from '../doubles/idGeneratorStub';
import { LoggerSpy } from '../doubles/loggerSpy';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { MessageSenderSpy } from '../doubles/messageSenderSpy';
import {
  assertLogInfoCall,
  assertUserExtractionLog,
  assertValidationErrorWithMessage,
} from '../utilities/assertions';
import {
  ERROR_CHAT_DOES_NOT_EXIST,
  ERROR_EMPTY_MESSAGE,
  ERROR_LONG_MESSAGE,
} from '../utilities/errorMessages';
import { removeSeconds } from '../utilities/helpers';
import {
  LOG_CHECKED_CHAT_EXISTENCE,
  LOG_CHECKED_MESSAGE_CORRESPONDENT_AVAILABILITY,
  LOG_FETCHED_CORRESPONDENT_ID,
  LOG_SAVED_MESSAGE,
  LOG_SENT_MESSAGE_TO_CORRESPONDENT,
} from '../utilities/logMessages';
import {
  emptyString,
  sampleChatId,
  sampleMessage,
  sampleUserToken,
  sampleXSS,
} from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidChatId,
  testWithInvalidToken,
} from '../utilities/tests';

let messageGatewaySpy: MessageGatewaySpy;
let idGeneratorStub: IdGeneratorStub;
let messageSenderSpy: MessageSenderSpy;

async function executeUseCase({
  tokenString = sampleUserToken,
  textString = sampleMessage,
  chatIdString = sampleChatId,
}: Partial<SendMessageRequest>): Promise<SendMessageResponse> {
  const uC = new SendMessageUseCase(
    Context.gateKeeper,
    Context.messageGateway,
    Context.idGenerator,
    Context.messageSender,
    Context.logger
  );
  return await uC.execute({ tokenString, textString, chatIdString });
}

function assertMessageWithDefaultValues(message: Message) {
  expect(message).toBeTruthy();
  expect(message.getId()).toBe(idGeneratorStub.STUB_ID);
  expect(message.getSenderId()).toBe(DefaultGateKeeper.defaultUser.getId());
  expect(message.getChatId()).toBe(sampleChatId);
  expect(message.getText()).toBe(sampleMessage);
  expect(removeSeconds(message.getCreatedAt().toISOString())).toBe(
    removeSeconds(new Date().toISOString())
  );
}

function assertCorrectCorrespondentIsFetched(msgGateway: MessageGatewaySpy) {
  expect(msgGateway.getCorrespondentIdCalls).toHaveLength(1);
  expect(msgGateway.getCorrespondentIdCalls[0].chatId.getId()).toBe(
    sampleChatId
  );
  expect(msgGateway.getCorrespondentIdCalls[0].userId).toBe(
    DefaultGateKeeper.defaultUser.getId()
  );
}

function assertCorrectMessageIsSent(
  msgSender: MessageSenderSpy,
  getCorrespondentIdResponse: string
) {
  expect(msgSender.isCorrespondentAvailableCalls).toHaveLength(1);
  expect(msgSender.isCorrespondentAvailableCalls[0].userId).toBe(
    getCorrespondentIdResponse
  );

  expect(msgSender.sendMessageCalls).toHaveLength(1);
  expect(msgSender.sendMessageCalls[0].recipientUserId).toBe(
    getCorrespondentIdResponse
  );
  assertMessageWithDefaultValues(msgSender.sendMessageCalls[0].message);
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  Context.userRepository = new DummyUserRepository();
  Context.logger = new LoggerSpy();
  messageGatewaySpy = new MessageGatewaySpy();
  Context.messageGateway = messageGatewaySpy;
  idGeneratorStub = new IdGeneratorStub();
  Context.idGenerator = idGeneratorStub;
  messageSenderSpy = new MessageSenderSpy();
  Context.messageSender = messageSenderSpy;
});

test('throws validation error if message is more than 1000 chars', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ textString: 'a'.repeat(10001) }),
    ERROR_LONG_MESSAGE
  );
});

test('throws validation error if message is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ textString: emptyString }),
    ERROR_EMPTY_MESSAGE
  );
});

testUserExtractionFailure(() => executeUseCase({}));

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));

testWithInvalidChatId((chatIdString) =>
  executeUseCase({ chatIdString: chatIdString })
);

test('throws if chat does not exist', async () => {
  messageGatewaySpy.doesChatExistResponse = false;

  assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_CHAT_DOES_NOT_EXIST
  );
});

test('saves message', async () => {
  await executeUseCase({});

  assertMessageWithDefaultValues(messageGatewaySpy.savedMessage);
});

test('sanitizes text', async () => {
  await executeUseCase({ textString: sampleXSS.XSSText });

  const savedMessage = messageGatewaySpy.savedMessage;
  expect(savedMessage.getText()).toBe(sampleXSS.sanitizedText);
});

test('sends message if correspondent is available', async () => {
  await executeUseCase({});

  assertCorrectCorrespondentIsFetched(messageGatewaySpy);
  assertCorrectMessageIsSent(
    messageSenderSpy,
    messageGatewaySpy.getCorrespondentIdResponse
  );
});

test('sends sanitized text', async () => {
  await executeUseCase({ textString: sampleXSS.XSSText });

  const sentMessage = messageSenderSpy.sendMessageCalls[0].message;
  expect(sentMessage.getText()).toBe(sampleXSS.sanitizedText);
});

test('returns correct response', async () => {
  const response = await executeUseCase({});

  assertCorrectResponse(response);

  function assertCorrectResponse(response: SendMessageResponse) {
    const savedMessage = messageGatewaySpy.savedMessage;
    expect({
      ...response.message,
      createdAt: removeSeconds(response.message.createdAt),
    }).toStrictEqual({
      id: savedMessage.getId(),
      senderId: savedMessage.getSenderId(),
      chatId: savedMessage.getChatId(),
      text: savedMessage.getText(),
      createdAt: removeSeconds(savedMessage.getCreatedAt().toISOString()),
    });
  }
});

test('logs info for happy path', async () => {
  await executeUseCase({});

  const loggerSpy = Context.logger as LoggerSpy;
  expect(loggerSpy.logInfoCalls.length).toBe(6);
  assertUserExtractionLog(loggerSpy.logInfoCalls[0]);
  assertChatExistenceLog(loggerSpy.logInfoCalls[1]);
  assertSavedMessageLog(loggerSpy.logInfoCalls[2]);
  assertFetchedCorrespondentLog(loggerSpy.logInfoCalls[3]);
  assertCorrespondentAvailabilityLog(loggerSpy.logInfoCalls[4]);
  assertSentMessageLog(loggerSpy.logInfoCalls[5]);

  function assertChatExistenceLog(call: unknown[]) {
    assertLogInfoCall({
      call,
      message: LOG_CHECKED_CHAT_EXISTENCE,
      obj: { chatId: sampleChatId },
    });
  }

  function assertSavedMessageLog(call: unknown[]) {
    assertLogInfoCall({
      call,
      message: LOG_SAVED_MESSAGE,
      obj: {
        messageId: idGeneratorStub.STUB_ID,
      },
    });
  }

  function assertFetchedCorrespondentLog(call: unknown[]) {
    assertLogInfoCall({
      call,
      message: LOG_FETCHED_CORRESPONDENT_ID,
      obj: {
        chatId: sampleChatId,
        correspondentId: messageGatewaySpy.getCorrespondentIdResponse,
      },
    });
  }

  function assertCorrespondentAvailabilityLog(call: unknown[]) {
    assertLogInfoCall({
      call,
      message: LOG_CHECKED_MESSAGE_CORRESPONDENT_AVAILABILITY,
      obj: {
        correspondentId: messageGatewaySpy.getCorrespondentIdResponse,
        wasAvailable: messageSenderSpy.isCorrespondentAvailableResponse,
      },
    });
  }

  function assertSentMessageLog(call: unknown[]) {
    expect(call[0]).toEqual(LOG_SENT_MESSAGE_TO_CORRESPONDENT);
    expect(call[1]).toEqual({
      correspondentId: messageGatewaySpy.getCorrespondentIdResponse,
      messageId: idGeneratorStub.STUB_ID,
    });
  }
});
