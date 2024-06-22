import Context from '../../src/adapter-api-express/context';
import { GateKeeperFailureStub } from '../doubles/gateKeeperFailureStub';
import { assertValidationErrorWithMessage } from './assertions';
import {
  ERROR_CHAT_ID_REQUIRED,
  ERROR_GENERIC,
  ERROR_INVALID_LIMIT,
  ERROR_INVALID_OFFSET,
  ERROR_INVALID_USER,
  ERROR_TOKEN_REQUIRED,
  ERROR_USERNAME_INVALID,
} from './errorMessages';
import { LoggerSpy } from '../doubles/loggerSpy';
import { ValidationError } from '../../src/core/errors';
import { PostRepositoryErrorStub } from '../doubles/postRepositoryErrorStub';
import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { DummyLogger } from '../../src/adapter-api-express/dummyLogger';
import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import { emptyString } from './samples';

export function testWithInvalidToken(
  useCaseExecution: (token: string) => Promise<unknown>
) {
  describe('throws with token-invalid error message', () => {
    test.each([[''], [null]])('when the token is %s', (token) => {
      assertValidationErrorWithMessage(
        () => useCaseExecution(token as string),
        ERROR_TOKEN_REQUIRED
      );
    });
  });
}

export function testUserExtractionFailure(
  useCaseExecutor: () => Promise<unknown>
) {
  test('throws if user extraction fails', () => {
    Context.gateKeeper = new GateKeeperFailureStub();

    assertValidationErrorWithMessage(useCaseExecutor, ERROR_INVALID_USER);
  });
}

export function testWithInvalidLimit(
  useCaseExecutor: (limit: number) => Promise<unknown>
) {
  describe('throws with limit-invalid validation error', () => {
    test.each([[21], [0], [-1]])('if the "limit" is %s', (limit) => {
      assertValidationErrorWithMessage(
        () => useCaseExecutor(limit),
        ERROR_INVALID_LIMIT
      );
    });
  });
}

export function testWithInvalidOffset(
  useCaseExecutor: (offset) => Promise<unknown>
) {
  test('throws if "offset" is less than zero', () => {
    assertValidationErrorWithMessage(
      () => useCaseExecutor(-1),
      ERROR_INVALID_OFFSET
    );
  });
}

export function testWithInvalidChatId(
  useCaseExecutor: (invalidChatId) => Promise<unknown>
) {
  describe('throws with Chat-id-required validation error', () => {
    test.each([[emptyString], [null]])('if chat id is %s', (invalidChatId) => {
      assertValidationErrorWithMessage(
        () => useCaseExecutor(invalidChatId),
        ERROR_CHAT_ID_REQUIRED
      );
    });
  });
}

export function testWithExpectedError(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: () => Promise<any>,
  {
    errorExpectation,
    errorMessage = ERROR_INVALID_USER,
  }: {
    errorExpectation?: (response) => void;
    errorMessage?: string;
  } = {}
) {
  describe('expected error', () => {
    beforeEach(() => (Context.gateKeeper = new GateKeeperFailureStub()));
    afterAll(() => {
      Context.gateKeeper = new DefaultGateKeeper();
      Context.logger = new DummyLogger();
    });

    test('passes expected error', async () => {
      const res = await action();

      if (errorExpectation) errorExpectation(res);
      else {
        expect(res.body.errors.length).toBe(1);
        expect(res.body.errors[0].message).toBe(errorMessage);
      }
    });

    test('logs expected error', async () => {
      Context.logger = new LoggerSpy();

      await action();

      expect((Context.logger as LoggerSpy).logErrorWasCalledWith).toStrictEqual(
        new ValidationError(errorMessage)
      );
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function testWithUnExpectedError(action: () => Promise<any>) {
  describe('Unexpected error', () => {
    beforeAll(() => (Context.postRepository = new PostRepositoryErrorStub()));
    afterAll(() => {
      Context.postRepository = new InMemoryPostRepository();
      Context.logger = new DummyLogger();
    });

    test('hides unexpected error', async () => {
      const res = await action();

      expect(res.body.errors.length).toBe(1);
      expect(res.body.errors[0].message).toBe(ERROR_GENERIC);
    });

    test('logs unexpected error', async () => {
      Context.logger = new LoggerSpy();

      await action();

      expect((Context.logger as LoggerSpy).logErrorWasCalledWith).toStrictEqual(
        new Error(PostRepositoryErrorStub.ERROR_MESSAGE)
      );
    });
  });
}

export function testWithInvalidUsername(
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
