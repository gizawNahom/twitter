import { assertValidationErrorWithMessage } from './assertions';
import { ERROR_INVALID_TOKEN } from './errorMessages';

export function testInvalidToken(useCaseExecution: (token: string) => void) {
  describe('throws with token-invalid error message', () => {
    test.each([[''], [null]])('when the token is %s', (token) => {
      assertValidationErrorWithMessage(
        () => useCaseExecution(token as string),
        ERROR_INVALID_TOKEN
      );
    });
  });
}
