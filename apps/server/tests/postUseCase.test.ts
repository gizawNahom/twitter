import { GateKeeper } from '../src/core/gateKeeper';
import { PostRepository } from '../src/core/postRepository';
import { User } from '../src/core/user';
import { Post } from '../src/core/post';
import { InMemoryPostRepository } from '../src/adapter-persistance-inMemory/InMemoryPostRepository';
import { PostUseCase } from '../src/core/postUseCase';

let uC: PostUseCase;
let postRepository: PostRepository;

function createSuccessUserGatewayStub(): GateKeeper {
  return new SuccessUserGatewayStub();
}

function createUseCase(userGateway: GateKeeper) {
  postRepository = new InMemoryPostRepository();
  return new PostUseCase(userGateway, postRepository);
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
  await uC.execute('userToken', text);
}

async function getSavedPosts(): Promise<Post[]> {
  const uId = SuccessUserGatewayStub.user.getId();
  const savedPosts = await postRepository.getAll(uId);
  return savedPosts as Post[];
}

async function assertValidationErrorWithMessage(
  task: () => unknown,
  errorMessage: string
) {
  await expect(task()).rejects.toThrow(errorMessage);
}

beforeEach(() => {
  uC = createUseCase(createSuccessUserGatewayStub());
});

test('throws validation error if text is more than 280 chars', () => {
  assertValidationErrorWithMessage(
    () => executeUseCaseWithText(generateRandomString(281)),
    "Text can't be more than 280 chars"
  );
});

test('throws if user is not valid', () => {
  uC = createUseCase(new FailureUserGatewayStub());

  assertValidationErrorWithMessage(
    () => executeUseCaseWithText(generateRandomString(280)),
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
  const text = generateRandomString(280);
  await executeUseCaseWithText(text);

  const savedPosts = await getSavedPosts();
  expect(savedPosts.length).toBe(1);
  const savedPost = savedPosts[0];
  expect(savedPost.getText()).toBe(text);
  expect(savedPost.getUserId()).toBe(SuccessUserGatewayStub.user.getId());
});

test('sanitizes text', async () => {
  const text = '<img src=x onerror=alert("XSS")>';
  await executeUseCaseWithText(text);

  const savedPost = (await getSavedPosts())[0];
  expect(savedPost.getText()).toEqual('<img src="x">');
});

class SuccessUserGatewayStub implements GateKeeper {
  static user: User = new User('123abc');
  extractUser(): User | null {
    return SuccessUserGatewayStub.user;
  }
}

class FailureUserGatewayStub implements GateKeeper {
  extractUser(): User | null {
    return null;
  }
}
