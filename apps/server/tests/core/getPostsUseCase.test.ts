import Context from '../../src/context';
import { Post } from '../../src/core/entities/post';
import {
  GetPostsResponse,
  GetPostsUseCase,
} from '../../src/core/useCases/getPostsUseCase';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { DummyUserRepository } from '../../src/dummyUserRepository';
import { GateKeeperFailureStub } from '../doubles/gateKeeperFailureStub';
import { LoggerSpy } from '../doubles/loggerSpy';
import { UserRepositoryFailureStub } from '../doubles/userRepositoryFailureStub';
import {
  assertLogInfoCall,
  assertUserExtractionLog,
  assertValidationErrorWithMessage,
} from '../utilities/assertions';
import {
  ERROR_INVALID_LIMIT,
  ERROR_INVALID_OFFSET,
  ERROR_USER_DOES_NOT_EXIST,
  ERROR_USER_ID_REQUIRED,
} from '../utilities/errorMessages';
import {
  sampleLimit,
  sampleOffset,
  sampleUserId,
  sampleUserToken,
} from '../utilities/samples';
import { testInvalidToken } from '../utilities/tests';

function executeUseCase({
  token = sampleUserToken,
  userId = sampleUserId,
  limit = sampleLimit,
  offset = sampleOffset,
}: {
  token?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}): Promise<GetPostsResponse> {
  return new GetPostsUseCase(
    Context.gateKeeper,
    Context.userRepository,
    Context.postRepository,
    Context.logger
  ).execute({
    token,
    userId,
    limit,
    offset,
  });
}

function createPosts(count: number): Post[] {
  const posts: Post[] = [];
  for (let i = 1; i < count + 1; i++) {
    const post = new Post();
    post.setId('postId' + i);
    post.setUserId(sampleUserId);
    posts.push(post);
  }
  return posts;
}

function savePosts(posts: Post[]) {
  posts.forEach(async (p) => {
    await savePost(p);
  });

  async function savePost(post: Post) {
    await Context.postRepository.save(post);
  }
}

afterEach(() => {
  Context.userRepository = new DummyUserRepository();
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

test('throws if the user id is empty', () => {
  assertValidationErrorWithMessage(
    () => executeUseCase({ userId: '' }),
    ERROR_USER_ID_REQUIRED
  );
});

testInvalidToken((token) => executeUseCase({ token }));

test('throws if the user id does not exist', async () => {
  Context.userRepository = new UserRepositoryFailureStub();

  assertValidationErrorWithMessage(
    () => executeUseCase({ userId: 'userId1' }),
    ERROR_USER_DOES_NOT_EXIST
  );
});

test('returns correct response', async () => {
  savePosts(createPosts(2));

  const response = await executeUseCase({});

  expect(response.posts).toStrictEqual(
    await Context.postRepository.getLatestPosts(
      sampleUserId,
      sampleLimit,
      sampleOffset
    )
  );
});

test('returns only the first 10 posts for unauthenticated requests', async () => {
  savePosts(createPosts(15));
  Context.gateKeeper = new GateKeeperFailureStub();

  const response = await executeUseCase({});

  expect(response.posts).toStrictEqual(
    await Context.postRepository.getLatestPosts(sampleUserId, 10, 0)
  );
});

test('logs happy path', async () => {
  Context.logger = new LoggerSpy();
  savePosts(createPosts(2));

  await executeUseCase({});

  const loggerSpy = Context.logger as LoggerSpy;
  expect(loggerSpy.logInfoCalls).toHaveLength(3);
  assertLogInfoCall({
    call: loggerSpy.logInfoCalls[0],
    message: 'Fetched user using id',
    obj: { id: sampleUserId },
  });
  assertUserExtractionLog(loggerSpy.logInfoCalls[1]);
  assertLogInfoCall({
    call: loggerSpy.logInfoCalls[2],
    message: 'Fetched user posts using id',
    obj: {
      userId: sampleUserId,
      limit: sampleLimit,
      offset: sampleOffset,
    },
  });
});
