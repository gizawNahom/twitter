import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import {
  createPostUseCase,
  PostUseCaseResponse,
} from '../../src/core/createPostUseCase';
import Context from '../../src/context';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { getSavedPosts, removeSeconds } from '../utilities/helpers';
import { FailureGateKeeperStub } from '../doubles/FailureGateKeeperStub';
import {
  ERROR_EMPTY_TEXT,
  ERROR_INVALID_USER,
} from '../utilities/errorMessages';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import { sampleUserToken } from '../utilities/samples';
import { testInvalidToken } from '../utilities/tests';

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
  const uC = new createPostUseCase(Context.gateKeeper, Context.postRepository);
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
});

test('throws validation error if text is more than 280 chars', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText({ text: generateRandomString(281) }),
    "Text can't be more than 280 chars"
  );
});

test('throws if user is not valid', () => {
  Context.gateKeeper = new FailureGateKeeperStub();

  assertValidationErrorWithMessage(
    () => executeUseCaseWithText({}),
    ERROR_INVALID_USER
  );
});

test('throws if text is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText({ text: '' }),
    ERROR_EMPTY_TEXT
  );
});

testInvalidToken((token) => executeUseCaseWithText({ token }));

test('saves post', async () => {
  await executeUseCaseWithText({});

  const savedPosts = await getSavedPosts();
  expect(savedPosts.length).toBe(1);
  const savedPost = savedPosts[0];
  expect(savedPost.getText()).toBe(validText);
  expect(savedPost.getUserId()).toBe(userId);
});

test('sanitizes text', async () => {
  const XSSText = '<img src=x onerror=alert("XSS")>';
  await executeUseCaseWithText({ text: XSSText });

  const savedPost = (await getSavedPosts())[0];
  expect(savedPost.getText()).toEqual('<img src="x">');
});

test('returns correct response', async () => {
  const res = await executeUseCaseWithText({});

  const exRes = await buildExpectedResponse();
  res.createdAt = removeSeconds(res.createdAt);
  expect(res).toStrictEqual(exRes);
});
