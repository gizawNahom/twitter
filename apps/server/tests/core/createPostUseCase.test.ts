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

let uC: createPostUseCase;
const userId = DefaultGateKeeper.defaultUser.getId();

function generateValidText() {
  return generateRandomString(280);
}

function createUseCase() {
  return new createPostUseCase(Context.gateKeeper, Context.postRepository);
}

function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join('');
}

async function executeUseCaseWithText(text: string) {
  return await uC.execute('userToken', text);
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
  uC = createUseCase();
});

afterEach(() => {
  Context.postRepository = new InMemoryPostRepository();
  Context.gateKeeper = new DefaultGateKeeper();
});

test('throws validation error if text is more than 280 chars', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText(generateRandomString(281)),
    "Text can't be more than 280 chars"
  );
});

test('throws if user is not valid', () => {
  Context.gateKeeper = new FailureGateKeeperStub();
  uC = createUseCase();

  assertValidationErrorWithMessage(
    () => executeUseCaseWithText(generateValidText()),
    ERROR_INVALID_USER
  );
});

test('throws if text is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText(''),
    ERROR_EMPTY_TEXT
  );
});

test('saves post', async () => {
  const text = generateValidText();
  await executeUseCaseWithText(text);

  const savedPosts = await getSavedPosts();
  expect(savedPosts.length).toBe(1);
  const savedPost = savedPosts[0];
  expect(savedPost.getText()).toBe(text);
  expect(savedPost.getUserId()).toBe(userId);
});

test('sanitizes text', async () => {
  const XSSText = '<img src=x onerror=alert("XSS")>';
  await executeUseCaseWithText(XSSText);

  const savedPost = (await getSavedPosts())[0];
  expect(savedPost.getText()).toEqual('<img src="x">');
});

test('returns correct response', async () => {
  const res = await executeUseCaseWithText(generateValidText());

  const exRes = await buildExpectedResponse();
  res.createdAt = removeSeconds(res.createdAt);
  expect(res).toStrictEqual(exRes);
});
