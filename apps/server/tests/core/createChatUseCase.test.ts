import Context from '../../src/context';
import { CreateChatUseCase } from '../../src/core/useCases/createChatUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { DummyUserRepository } from '../../src/dummyUserRepository';
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

const emptyString = ' \n\t\r';
const sampleUsername = 'sampleUserName';

function executeUseCase({
  tokenString = sampleUserToken,
  usernameString = sampleUsername,
}: {
  tokenString?: string;
  usernameString?: string;
}): Promise<unknown> {
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

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  Context.userRepository = new DummyUserRepository();
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
  const userRepo = new UserRepositorySpy();
  userRepo.getUserIdResponse = null;
  Context.userRepository = userRepo;

  await assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_USER_DOES_NOT_EXIST
  );
  expect(userRepo.getUserIdCalls).toHaveLength(1);
  expect(userRepo.getUserIdCalls[0].username.getUsername()).toBe(
    sampleUsername
  );
});

test('creates chat', async () => {
  const userRepo = new UserRepositorySpy();
  userRepo.getUserIdResponse = sampleUserId;
  Context.userRepository = userRepo;

  await executeUseCase({});

  assertChatWasCreated();

  function assertChatWasCreated() {
    const spy = Context.messageGateway as MessageGatewaySpy;
    expect(spy.saveChatCalls).toHaveLength(1);
    assertCorrectSavedChat(spy.saveChatCalls[0].chat);

    function assertCorrectSavedChat(chat) {
      const idGeneratorStub = Context.idGenerator as IdGeneratorStub;
      expect(chat).toBeTruthy();
      expect(chat.getId()).toBe(idGeneratorStub.STUB_ID);
      expect(removeSeconds(chat.getCreatedAt().toISOString())).toBe(
        removeSeconds(new Date().toISOString())
      );
      const participants = chat.getParticipants();
      expect(participants).toContain(DefaultGateKeeper.defaultUser.getId());
      expect(participants).toContain(userRepo.getUserIdResponse);
    }
  }
});

test.todo('does not create chat if it already exists');
test.todo('returns created chat');
test.todo('returns existing chat');
