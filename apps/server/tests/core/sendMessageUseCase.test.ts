import Context from '../../src/context';
import { Message } from '../../src/core/entities/message';
import { MessageGateway } from '../../src/core/ports/messageGateway';
import { MessageSender } from '../../src/core/ports/messageSender';
import { SendMessageUseCase } from '../../src/core/useCases/sendMessageUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { DummyUserRepository } from '../../src/dummyUserRepository';
import { IdGeneratorStub } from '../doubles/idGeneratorStub';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { MessageSenderSpy } from '../doubles/messageSenderSpy';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import {
  ERROR_CHAT_DOES_NOT_EXIST,
  ERROR_CHAT_ID_REQUIRED,
  ERROR_EMPTY_MESSAGE,
  ERROR_LONG_MESSAGE,
} from '../utilities/errorMessages';
import { removeSeconds } from '../utilities/helpers';
import { sampleUserToken, sampleXSS } from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidToken,
} from '../utilities/tests';

const emptyString = ' \n\t\r';
const sampleMessage = 'sample message';
const sampleChatId = 'chatId123';
let messageGateway: MessageGateway;
let idGeneratorStub: IdGeneratorStub;
let messageSender: MessageSender;

async function executeUseCase({
  token = sampleUserToken,
  text = sampleMessage,
  chatId = sampleChatId,
}: {
  text?: string;
  token?: string;
  chatId?: string;
}) {
  const uC = new SendMessageUseCase(
    Context.gateKeeper,
    messageGateway,
    idGeneratorStub,
    messageSender
  );
  return await uC.execute({ token, text, chatId });
}

function assertMessageWithDefaultValues(savedMessage: Message) {
  expect(savedMessage).toBeTruthy();
  expect(savedMessage.getId()).toBe(idGeneratorStub.STUB_ID);
  expect(savedMessage.getSenderId()).toBe(
    DefaultGateKeeper.defaultUser.getId()
  );
  expect(savedMessage.getChatId()).toBe(sampleChatId);
  expect(savedMessage.getText()).toBe(sampleMessage);
  expect(removeSeconds(savedMessage.getCreatedAt().toISOString())).toBe(
    removeSeconds(new Date().toISOString())
  );
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  Context.userRepository = new DummyUserRepository();
  messageGateway = new MessageGatewaySpy();
  idGeneratorStub = new IdGeneratorStub();
  messageSender = new MessageSenderSpy();
});

test('throws validation error if message is more than 1000 chars', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ text: 'a'.repeat(10001) }),
    ERROR_LONG_MESSAGE
  );
});

test('throws validation error if message is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ text: emptyString }),
    ERROR_EMPTY_MESSAGE
  );
});

testUserExtractionFailure(() => executeUseCase({}));

testWithInvalidToken((token) => executeUseCase({ token }));

test('throws if the chat id is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ chatId: emptyString }),
    ERROR_CHAT_ID_REQUIRED
  );
});

test('throws if chat does not exist', async () => {
  (messageGateway as MessageGatewaySpy).doesChatExistResponse = false;

  assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_CHAT_DOES_NOT_EXIST
  );
});

test('saves message', async () => {
  await executeUseCase({});

  assertMessageWithDefaultValues(
    (messageGateway as MessageGatewaySpy).savedMessage
  );
});

test('sanitizes text', async () => {
  await executeUseCase({ text: sampleXSS.XSSText });

  const savedMessage = (messageGateway as MessageGatewaySpy).savedMessage;
  expect(savedMessage.getText()).toBe(sampleXSS.sanitizedText);
});

test('sends Message if Recipient is available', async () => {
  await executeUseCase({});

  const msgSender = messageSender as MessageSenderSpy;
  const msgGateway = messageGateway as MessageGatewaySpy;

  expect(msgGateway.getCorrespondentIdCalls).toHaveLength(1);
  expect(msgGateway.getCorrespondentIdCalls[0].chatId.getId()).toBe(
    sampleChatId
  );
  expect(msgGateway.getCorrespondentIdCalls[0].userId).toBe(
    DefaultGateKeeper.defaultUser.getId()
  );

  expect(msgSender.isRecipientAvailableCalls).toHaveLength(1);
  expect(msgSender.isRecipientAvailableCalls[0].userId).toBe(
    msgGateway.getCorrespondentIdResponse
  );

  expect(msgSender.sendMessageCalls).toHaveLength(1);
  expect(msgSender.sendMessageCalls[0].recipientUserId).toBe(
    msgGateway.getCorrespondentIdResponse
  );
  assertMessageWithDefaultValues(msgSender.sendMessageCalls[0].message);
});
