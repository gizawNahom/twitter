import { GetUserUseCase } from '../../src/core/useCases/getUserUseCase';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import { ERROR_USERNAME_INVALID } from '../utilities/errorMessages';
import {
  emptyString,
  sampleLimit,
  sampleOffset,
  sampleUserToken,
} from '../utilities/samples';
import {
  testWithInvalidLimit,
  testWithInvalidOffset,
  testWithInvalidToken,
} from '../utilities/tests';

const sampleUsername = 'sampleUserName';

async function executeUseCase({
  tokenString = sampleUserToken,
  limitValue = sampleLimit,
  offsetValue = sampleOffset,
  usernameString = sampleUsername,
}: {
  tokenString?: string;
  limitValue?: number;
  offsetValue?: number;
  usernameString?: string;
}) {
  const uC = new GetUserUseCase();
  return await uC.execute({
    tokenString,
    limitValue,
    offsetValue,
    usernameString,
  });
}

testWithInvalidToken((tokenString) => executeUseCase({ tokenString }));

testWithInvalidLimit((limitValue) => executeUseCase({ limitValue }));

testWithInvalidOffset((offsetValue) => executeUseCase({ offsetValue }));

testWithInvalidUsername((usernameString) => executeUseCase({ usernameString }));

function testWithInvalidUsername(
  useCaseExecution: (usernameString) => Promise<unknown>
) {
  describe('throws with invalid username error message', () => {
    test.each([[emptyString], ['a'.repeat(4)], ['/?<.>'], ['a'.repeat(16)]])(
      'when username is %s',
      async (usernameString) => {
        assertValidationErrorWithMessage(
          () => useCaseExecution(usernameString),
          ERROR_USERNAME_INVALID
        );
      }
    );
  });
}
