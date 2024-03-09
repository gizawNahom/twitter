import Context from '../../src/context';
import { PostIndexGateway } from '../../src/core/ports/postIndexGateway';
import { SearchPostsUseCase } from '../../src/core/useCases/searchPostsUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { GateKeeperFailureStub } from '../doubles/gateKeeperFailureStub';
import { PostIndexGatewaySpy } from '../doubles/postIndexGatewaySpy';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import {
  ERROR_INVALID_LIMIT,
  ERROR_INVALID_OFFSET,
  ERROR_INVALID_QUERY,
  ERROR_INVALID_USER,
} from '../utilities/errorMessages';
import { sampleUserToken } from '../utilities/samples';
import { testInvalidToken } from '../utilities/tests';

const sampleLimit = 1;
const sampleOffset = 0;
const sampleQueryText = 'query';

let postIndexGateway: PostIndexGateway;

function executeUseCase({
  token = sampleUserToken,
  query = sampleQueryText,
  limit = sampleLimit,
  offset = sampleOffset,
}: {
  token?: string;
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<void> {
  postIndexGateway = new PostIndexGatewaySpy();
  return new SearchPostsUseCase(
    Context.gateKeeper,
    postIndexGateway,
    Context.logger
  ).execute({
    token,
    query,
    limit,
    offset,
  });
}

afterEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
});

describe('throws with limit-invalid validation error', () => {
  test.each([[21], [0], [-1]])('if the "limit" is %s', (limit) => {
    assertValidationErrorWithMessage(
      () => executeUseCase({ limit }),
      ERROR_INVALID_LIMIT
    );
  });
});

test('throws if "offset" is less than zero', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ offset: -1 }),
    ERROR_INVALID_OFFSET
  );
});

testInvalidToken((token) => executeUseCase({ token }));

test('throws if user extraction fails', () => {
  Context.gateKeeper = new GateKeeperFailureStub();
  assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_INVALID_USER
  );
});

describe('throws if query text is invalid', () => {
  const MORE_THAN_50_CHARS =
    '01234567891011121314151617181920212223242526272829301';

  test.each([[''], [MORE_THAN_50_CHARS]])('if the "text" is %s', (query) => {
    assertValidationErrorWithMessage(
      () => executeUseCase({ query }),
      ERROR_INVALID_QUERY
    );
  });
});

test('calls indexer correctly', async () => {
  await executeUseCase({});

  const spy = postIndexGateway as PostIndexGatewaySpy;
  expect(spy.queryCalls.length).toBe(1);
  const call = spy.queryCalls[0];
  expect(call.text).toBe(sampleQueryText);
  expect(call.offset).toBe(sampleOffset);
  expect(call.limit).toBe(sampleLimit);
});

describe('sanitizes query text', () => {
  test.each([
    ['<img src=x onerror=alert("XSS")>', '<img src="x">'],
    ['{!join from=id }', '!join from=id '],
  ])('if the "text" is %s', async (query, expected) => {
    await executeUseCase({ query });

    const spy = postIndexGateway as PostIndexGatewaySpy;
    expect(spy.queryCalls[0].text).toBe(expected);
  });
});

// test('returns correct response', async () => {
//   await executeUseCase({});
// });
