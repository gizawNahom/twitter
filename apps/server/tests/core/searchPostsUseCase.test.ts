import Context from '../../src/context';
import { PostIndexGateway } from '../../src/core/ports/postIndexGateway';
import {
  SearchPostsResponse,
  SearchPostsUseCase,
} from '../../src/core/useCases/searchPostsUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { LoggerSpy } from '../doubles/loggerSpy';
import { PostIndexGatewaySpy } from '../doubles/postIndexGatewaySpy';
import {
  assertLogInfoCall,
  assertUserExtractionLog,
  assertValidationErrorWithMessage,
} from '../utilities/assertions';
import { ERROR_INVALID_QUERY } from '../utilities/errorMessages';
import { LOG_FETCHED_SEARCH_RESULT } from '../utilities/logMessages';
import {
  sampleLimit,
  sampleOffset,
  sampleQueryText,
  sampleUserToken,
  sampleXSS,
} from '../utilities/samples';
import {
  testWithInvalidToken,
  testUserExtractionFailure,
  testWithInvalidLimit,
  testWithInvalidOffset,
} from '../utilities/tests';

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
}): Promise<SearchPostsResponse> {
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

testWithInvalidLimit((limit: number) => executeUseCase({ limit }));

testWithInvalidOffset((offset) => executeUseCase({ offset }));

testWithInvalidToken((token) => executeUseCase({ token }));

testUserExtractionFailure(() => executeUseCase({}));

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
    [sampleXSS.XSSText, sampleXSS.sanitizedText],
    ['{!join from=id }', '!join from=id '],
  ])('if the "text" is %s', async (query, expected) => {
    await executeUseCase({ query });

    const spy = postIndexGateway as PostIndexGatewaySpy;
    expect(spy.queryCalls[0].text).toBe(expected);
  });
});

test('returns correct response', async () => {
  const response: SearchPostsResponse = await executeUseCase({});

  expect(response.posts).toStrictEqual(PostIndexGatewaySpy.queryResponse);
});

test('logs happy path', async () => {
  Context.logger = new LoggerSpy();

  await executeUseCase({});

  const loggerSpy = Context.logger as LoggerSpy;
  expect(loggerSpy.logInfoCalls).toHaveLength(2);
  assertUserExtractionLog(loggerSpy.logInfoCalls[0]);
  assertLogInfoCall({
    call: loggerSpy.logInfoCalls[1],
    message: LOG_FETCHED_SEARCH_RESULT,
    obj: {
      query: sampleQueryText,
      limit: sampleLimit,
      offset: sampleOffset,
    },
  });
});
