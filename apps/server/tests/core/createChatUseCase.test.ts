import Context from '../../src/context';
import { CreateChatUseCase } from '../../src/core/useCases/createChatUseCase';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import { ERROR_USERNAME_INVALID } from '../utilities/errorMessages';
import { sampleUserToken } from '../utilities/samples';
import {
  testUserExtractionFailure,
  testWithInvalidToken,
} from '../utilities/tests';

const emptyString = ' \n\t\r';

function executeUseCase({
  tokenString = sampleUserToken,
  usernameString = 'sampleUserName',
}: {
  tokenString?: string;
  usernameString?: string;
}): Promise<unknown> {
  return new CreateChatUseCase(Context.gateKeeper, Context.logger).execute({
    tokenString,
    usernameString,
  });
}

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

describe('throws with invalid username error message', () => {
  test.each([[emptyString]])('when username is %s', async (usernameString) => {
    assertValidationErrorWithMessage(
      () => executeUseCase({ usernameString }),
      ERROR_USERNAME_INVALID
    );
  });
});

testUserExtractionFailure(() => executeUseCase({}));

test.todo('username must exist');
test.todo('creates chat');
test.todo('does not create chat if it already exists');
test.todo('returns created chat');
test.todo('returns existing chat');
