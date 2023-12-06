import { GateKeeper } from '../../src/core/gateKeeper';
import { PostRepository } from '../../src/core/postRepository';
import { User } from '../../src/core/user';
import { Post } from '../../src/core/post';
import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import { PostUseCase, PostUseCaseResponse } from '../../src/core/postUseCase';
import Context from '../../src/context';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';

class FailureGateKeeperStub implements GateKeeper {
  async extractUser(): Promise<User | null> {
    return null;
  }
}

let uC: PostUseCase;
const userId = DefaultGateKeeper.defaultUser.getId();

function generateValidText() {
  return generateRandomString(280);
}

function createUseCase() {
  return new PostUseCase(Context.gateKeeper, Context.postRepository);
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

async function getSavedPosts(): Promise<Post[]> {
  const savedPosts = await Context.postRepository.getAll(userId);
  return savedPosts as Post[];
}

async function assertValidationErrorWithMessage(
  task: () => unknown,
  errorMessage: string
) {
  await expect(task()).rejects.toThrow(errorMessage);
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

function removeSeconds(isoString: string) {
  return isoString.slice(0, isoString.lastIndexOf(':'));
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
    'User is not valid'
  );
});

test('throws if text is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText(''),
    "Text can't be empty"
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
