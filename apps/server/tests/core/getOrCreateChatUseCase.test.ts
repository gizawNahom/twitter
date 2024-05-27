import Context from '../../src/context';
import {
  GetOrCreateChatResponse,
  GetOrCreateChatUseCase,
} from '../../src/core/useCases/getOrCreateChatUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { UserRepositorySpy } from '../doubles/userRepositorySpy';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import {
  ERROR_USERNAME_INVALID,
  ERROR_USER_DOES_NOT_EXIST,
} from '../utilities/errorMessages';
import {
  sampleUser1,
  sampleUser2,
  sampleUserId,
  sampleUserToken,
} from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidToken,
} from '../utilities/tests';
import { MessageGatewaySpy } from '../doubles/messageGatewaySpy';
import { IdGeneratorStub } from '../doubles/idGeneratorStub';
import { removeSeconds } from '../utilities/helpers';
import { Chat } from '../../src/core/entities/chat';
import { ChatId } from '../../src/core/valueObjects/chatId';
import { User } from '../../src/core/entities/user';

const emptyString = ' \n\t\r';
const sampleUsername = 'sampleUserName';
let userRepoSpy: UserRepositorySpy;

function executeUseCase({
  tokenString = sampleUserToken,
  usernameString = sampleUsername,
}: {
  tokenString?: string;
  usernameString?: string;
}): Promise<GetOrCreateChatResponse> {
  return new GetOrCreateChatUseCase(
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
  return (Context.messageGateway as MessageGatewaySpy).saveChatCalls;
}

function stubGetChatResponse(msgGateway: MessageGatewaySpy) {
  msgGateway.getChatResponse = new Chat(
    new ChatId('globallyUniqueId'),
    [sampleUser1, sampleUser2],
    new Date(2019)
  );
  return msgGateway.getChatResponse;
}

function assertCorrectResponse(
  response: GetOrCreateChatResponse,
  createdAt: Date
) {
  const idGeneratorStub = Context.idGenerator as IdGeneratorStub;
  expect(response.chatId).toBe(idGeneratorStub.STUB_ID);
  expect(removeSeconds(response.createdAt.toISOString())).toBe(
    removeSeconds(createdAt.toISOString())
  );
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  userRepoSpy = new UserRepositorySpy();
  userRepoSpy.getUserResponse = sampleUser1;
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
  userRepoSpy.getUserResponse = null;
  Context.userRepository = userRepoSpy;

  await assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_USER_DOES_NOT_EXIST
  );
  assertGetUserCall(userRepoSpy.getUserCalls);

  function assertGetUserCall(getUserCalls) {
    expect(getUserCalls).toHaveLength(1);
    expect(getUserCalls[0].username.getUsername()).toBe(sampleUsername);
  }
});

test('creates chat', async () => {
  await executeUseCase({});

  assertChatWasCreated();

  function assertChatWasCreated() {
    const calls = getSaveChatCalls();
    expect(calls).toHaveLength(1);
    assertCorrectSavedChat(calls[0].chat);

    function assertCorrectSavedChat(chat: Chat) {
      const idGeneratorStub = Context.idGenerator as IdGeneratorStub;
      expect(chat).toBeTruthy();
      expect(chat.getId()).toBe(idGeneratorStub.STUB_ID);
      expect(removeSeconds(chat.getCreatedAt().toISOString())).toBe(
        removeSeconds(new Date().toISOString())
      );
      const participantIds = chat.getParticipants().map((u) => u.getId());
      expect(participantIds).toContain(DefaultGateKeeper.defaultUser.getId());
      expect(participantIds).toContain(userRepoSpy.getUserResponse?.getId());
    }
  }
});

test('does not create chat if it already exists', async () => {
  const msgGateway = Context.messageGateway as MessageGatewaySpy;
  stubGetChatResponse(msgGateway);

  await executeUseCase({});

  expect(getSaveChatCalls()).toHaveLength(0);
  const getChatCalls = msgGateway.getChatCalls;
  expect(getChatCalls).toHaveLength(1);
  expect(getChatCalls[0]).toContain(DefaultGateKeeper.defaultUser.getId());
  expect(getChatCalls[0]).toContain(userRepoSpy.getUserResponse?.getId());
});

test('returns created chat', async () => {
  const response = await executeUseCase({});

  assertCorrectResponse(response, new Date());
});

test('returns existing chat', async () => {
  const getChatResponse = stubGetChatResponse(
    Context.messageGateway as MessageGatewaySpy
  );

  const response = await executeUseCase({});

  assertCorrectResponse(response, getChatResponse.getCreatedAt());
});
