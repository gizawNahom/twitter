import Context from '../../src/context';
import { FailureGateKeeperStub } from '../doubles/failureGateKeeperStub';
import { assertValidationErrorWithMessage } from './assertions';
import {
  ERROR_GENERIC,
  ERROR_INVALID_USER,
  ERROR_TOKEN_REQUIRED,
} from './errorMessages';
import { LoggerSpy } from '../doubles/loggerSpy';
import { ValidationError } from '../../src/core/errors';
import { PostRepositoryExceptionStub } from '../doubles/postRepositoryExceptionStub';

export function testInvalidToken(useCaseExecution: (token: string) => void) {
  describe('throws with token-invalid error message', () => {
    test.each([[''], [null]])('when the token is %s', (token) => {
      assertValidationErrorWithMessage(
        () => useCaseExecution(token as string),
        ERROR_TOKEN_REQUIRED
      );
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handlesValidationErrorTest(action: () => Promise<any>) {
  test('passes validation errors', async () => {
    Context.gateKeeper = new FailureGateKeeperStub();
    const res = await action();

    expect(res.body.errors.length).toBe(1);
    expect(res.body.errors[0].message).toBe(ERROR_INVALID_USER);
  });

  test('logs validation errors', async () => {
    Context.logger = new LoggerSpy();
    Context.gateKeeper = new FailureGateKeeperStub();
    await action();

    expect((Context.logger as LoggerSpy).logErrorWasCalledWith).toStrictEqual(
      new ValidationError(ERROR_INVALID_USER)
    );
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handlesNonValidationErrorTest(action: () => Promise<any>) {
  describe('Unexpected error', () => {
    beforeAll(
      () => (Context.postRepository = new PostRepositoryExceptionStub())
    );

    test('hides unexpected error', async () => {
      const res = await action();

      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors[0].message).toBe(ERROR_GENERIC);
    });

    test('logs unexpected error', async () => {
      await action();

      expect((Context.logger as LoggerSpy).logErrorWasCalledWith).toStrictEqual(
        new Error(PostRepositoryExceptionStub.ERROR_MESSAGE)
      );
    });
  });
}
