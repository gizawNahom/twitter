import { CreateChatUseCase } from '../../src/core/useCases/createChatUseCase';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import { ERROR_USERNAME_INVALID } from '../utilities/errorMessages';
import { sampleUserToken } from '../utilities/samples';
import { testWithInvalidToken } from '../utilities/tests';

const emptyString = ' \n\t\r';

function executeUseCase({
  tokenString = sampleUserToken,
  username = 'sampleUserName',
}: {
  tokenString?: string;
  username?: string;
}): Promise<unknown> {
  return new CreateChatUseCase().execute({
    tokenString,
    username,
  });
}

testWithInvalidToken((tokenString) => {
  return executeUseCase({ tokenString });
});

describe('throws with invalid username error message', () => {
  test.each([[emptyString]])('when username is %s', async (username) => {
    assertValidationErrorWithMessage(
      () => executeUseCase({ username }),
      ERROR_USERNAME_INVALID
    );
  });
});
