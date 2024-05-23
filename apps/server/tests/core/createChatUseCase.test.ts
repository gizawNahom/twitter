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
import { sampleUserToken } from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidToken,
} from '../utilities/tests';

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
  userRepo.doesUserExistResponse = false;
  Context.userRepository = userRepo;

  await assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_USER_DOES_NOT_EXIST
  );
  expect(userRepo.doesUserExistCalls).toHaveLength(1);
  expect(userRepo.doesUserExistCalls[0].username.getUsername()).toBe(
    sampleUsername
  );
});

test.todo('creates chat');
test.todo('does not create chat if it already exists');
test.todo('returns created chat');
test.todo('returns existing chat');
