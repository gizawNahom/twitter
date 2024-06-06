import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import {
  CreatePostUseCase,
  PostUseCaseResponse,
} from '../../src/core/useCases/createPostUseCase';
import Context from '../../src/adapter-api-express/context';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { getSavedPosts, removeSeconds } from '../utilities/helpers';
import { ERROR_EMPTY_TEXT } from '../utilities/errorMessages';
import {
  assertPostEquality,
  assertUserExtractionLog,
  assertValidationErrorWithMessage,
} from '../utilities/assertions';
import { sampleUserToken, sampleXSS } from '../utilities/samples';
import {
  testWithInvalidToken,
  testUserExtractionFailure,
} from '../utilities/tests';
import { LoggerSpy } from '../doubles/loggerSpy';
import { LOG_SAVED_POST } from '../utilities/logMessages';
import { Post } from '../../src/core/entities/post';

const userId = DefaultGateKeeper.defaultUser.getId();
const validText = generateValidText();

function generateValidText() {
  return generateRandomString(280);
}

function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join('');
}

async function executeUseCaseWithText({
  token = sampleUserToken,
  text = validText,
}: {
  token?: string;
  text?: string;
}) {
  const uC = new CreatePostUseCase(
    Context.logger,
    Context.gateKeeper,
    Context.postRepository
  );
  return await uC.execute(token, text);
}

async function buildExpectedResponse() {
  const savedPost = (await getSavedPosts())[0];
  const expectedResponse = new PostUseCaseResponse();
  expectedResponse.id = savedPost.getId();
  expectedResponse.text = savedPost.getText();
  expectedResponse.userId = savedPost.getUserId();
  expectedResponse.createdAt = removeSeconds(
    savedPost.getCreatedAt().toISOString()
  );
  return expectedResponse;
}

beforeEach(() => {
  Context.postRepository = new InMemoryPostRepository();
  Context.gateKeeper = new DefaultGateKeeper();
  Context.logger = new LoggerSpy();
});

test('throws validation error if text is more than 280 chars', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText({ text: generateRandomString(281) }),
    "Text can't be more than 280 chars"
  );
});

testUserExtractionFailure(() => executeUseCaseWithText({}));

test('throws if text is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText({ text: '' }),
    ERROR_EMPTY_TEXT
  );
});

testWithInvalidToken((token) => executeUseCaseWithText({ token }));

test('saves post', async () => {
  await executeUseCaseWithText({});

  const savedPosts = await getSavedPosts();
  expect(savedPosts.length).toBe(1);
  const savedPost = savedPosts[0];
  expect(savedPost.getText()).toBe(validText);
  expect(savedPost.getUserId()).toBe(userId);
});

test('sanitizes text', async () => {
  await executeUseCaseWithText({ text: sampleXSS.XSSText });

  const savedPost = (await getSavedPosts())[0];
  expect(savedPost.getText()).toEqual(sampleXSS.sanitizedText);
});

test('returns correct response', async () => {
  const res = await executeUseCaseWithText({});

  const exRes = await buildExpectedResponse();
  res.createdAt = removeSeconds(res.createdAt);
  expect(res).toStrictEqual(exRes);
});

test('logs info for happy path', async () => {
  await executeUseCaseWithText({});

  const loggerSpy = Context.logger as LoggerSpy;
  expect(loggerSpy.logInfoCalls.length).toBe(2);
  assertUserExtractionLog(loggerSpy.logInfoCalls[0]);
  expect(loggerSpy.logInfoCalls[1][0]).toEqual(LOG_SAVED_POST);
  const arg = loggerSpy.logInfoCalls[1][1] as { post: Post };
  assertPostEquality(arg.post, (await getSavedPosts())[0]);
});
