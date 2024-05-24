import Context from '../../src/context';
import {
  CreateChatResponse,
  CreateChatUseCase,
} from '../../src/core/useCases/createChatUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { UserRepositorySpy } from '../doubles/userRepositorySpy';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import {
  ERROR_USERNAME_INVALID,
  ERROR_USER_DOES_NOT_EXIST,
} from '../utilities/errorMessages';
import { sampleUserId, sampleUserToken } from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidToken,
} from '../utilities/tests';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { IdGeneratorStub } from '../doubles/idGeneratorStub';
import { removeSeconds } from '../utilities/helpers';
import { Chat } from '../../src/core/entities/chat';
import { ChatId } from '../../src/core/valueObjects/chatId';

const emptyString = ' \n\t\r';
const sampleUsername = 'sampleUserName';
let userRepoSpy: UserRepositorySpy;

function executeUseCase({
  tokenString = sampleUserToken,
  usernameString = sampleUsername,
}: {
  tokenString?: string;
  usernameString?: string;
}): Promise<CreateChatResponse> {
  return new CreateChatUseCase(
    Context.idGenerator,
    Context.messageGateway,
    Context.userRepository,
    Context.gateKeeper,
    Context.logger
  ).execute({
    tokenString,
    usernameString,
  });
}

function getSaveChatCalls() {
  const spy = Context.messageGateway as MessageGatewaySpy;
  const calls = spy.saveChatCalls;
  return calls;
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  userRepoSpy = new UserRepositorySpy();
  userRepoSpy.getUserIdResponse = sampleUserId;
  Context.userRepository = userRepoSpy;
  Context.messageGateway = new MessageGatewaySpy();
  Context.idGenerator = new IdGeneratorStub();
});

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

describe('throws with invalid username error message', () => {
  test.each([[emptyString], ['a'.repeat(4)], ['/?<.>'], ['a'.repeat(16)]])(
    'when username is %s',
    async (usernameString) => {
      assertValidationErrorWithMessage(
        () => executeUseCase({ usernameString }),
        ERROR_USERNAME_INVALID
      );
    }
  );
});

testUserExtractionFailure(() => executeUseCase({}));

test('throws if username does not exist', async () => {
  userRepoSpy.getUserIdResponse = null;
  Context.userRepository = userRepoSpy;

  await assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_USER_DOES_NOT_EXIST
  );
  expect(userRepoSpy.getUserIdCalls).toHaveLength(1);
  expect(userRepoSpy.getUserIdCalls[0].username.getUsername()).toBe(
    sampleUsername
  );
});

test('creates chat', async () => {
  await executeUseCase({});

  assertChatWasCreated();

  function assertChatWasCreated() {
    const calls = getSaveChatCalls();
    expect(calls).toHaveLength(1);
    assertCorrectSavedChat(calls[0].chat);

    function assertCorrectSavedChat(chat) {
      const idGeneratorStub = Context.idGenerator as IdGeneratorStub;
      expect(chat).toBeTruthy();
      expect(chat.getId()).toBe(idGeneratorStub.STUB_ID);
      expect(removeSeconds(chat.getCreatedAt().toISOString())).toBe(
        removeSeconds(new Date().toISOString())
      );
      const participants = chat.getParticipants();
      expect(participants).toContain(DefaultGateKeeper.defaultUser.getId());
      expect(participants).toContain(userRepoSpy.getUserIdResponse);
    }
  }
});

test('does not create chat if it already exists', async () => {
  const msgGateway = new MessageGatewaySpy();
  msgGateway.getChatResponse = new Chat(
    new ChatId('globallyUniqueId'),
    ['', ''],
    new Date()
  );
  Context.messageGateway = msgGateway;

  await executeUseCase({});

  expect(getSaveChatCalls()).toHaveLength(0);
  expect(msgGateway.getChatCalls).toHaveLength(1);
  expect(msgGateway.getChatCalls[0]).toContain(
    DefaultGateKeeper.defaultUser.getId()
  );
  expect(msgGateway.getChatCalls[0]).toContain(userRepoSpy.getUserIdResponse);
});

test('returns created chat', async () => {
  const response = await executeUseCase({});

  const idGeneratorStub = Context.idGenerator as IdGeneratorStub;
  expect(response.chatId).toBe(idGeneratorStub.STUB_ID);
  expect(removeSeconds(response.createdAt.toISOString())).toBe(
    removeSeconds(new Date().toISOString())
  );
});

test.todo('returns existing chat');
