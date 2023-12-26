import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import Context from '../../src/context';
import {
  GetPostUseCase,
  GetPostUseCaseResponse,
} from '../../src/core/getPostUseCase';
import { Post } from '../../src/core/post';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { LoggerSpy } from '../doubles/loggerSpy';
import { PostRepositoryNullStub } from '../doubles/postRepositoryNullStub';
import { FailureGateKeeperStub } from '../doubles/FailureGateKeeperStub';
import {
  ERROR_INVALID_POST_ID,
  ERROR_INVALID_TOKEN,
  ERROR_INVALID_USER,
} from '../utilities/errorMessages';
import { removeSeconds } from '../utilities/helpers';
import { assertValidationErrorWithMessage } from '../utilities/assertions';
import { userToken } from '../utilities/constants';

const postId = 'postId1';

function createUseCase() {
  return new GetPostUseCase(
    Context.logger,
    Context.gateKeeper,
    Context.postRepository
  );
}

async function executeUseCase({
  uC,
  token = userToken,
  postId: pId = postId,
}: {
  uC: GetPostUseCase;
  token?: string;
  postId?: string | null;
}) {
  return await uC.execute(token, pId);
}

function createdSavedPost() {
  const savedPost = new Post();
  savedPost.setId(postId);
  savedPost.setText('post text');
  savedPost.setUserId('userId1');
  savedPost.setCreatedAt(new Date());
  return savedPost;
}

function createdExpectedRes(savedPost: Post) {
  const expectedRes = new GetPostUseCaseResponse();
  expectedRes.id = savedPost.getId();
  expectedRes.text = savedPost.getText();
  expectedRes.userId = savedPost.getUserId();
  expectedRes.createdAt = removeSeconds(savedPost.getCreatedAt().toISOString());
  return expectedRes;
}

function assertPostEquality(post: Post, savedPost: Post) {
  expect(post.getId()).toBe(savedPost.getId());
  expect(post.getText()).toBe(savedPost.getText());
  expect(post.getUserId()).toBe(savedPost.getUserId());
  expect(removeSeconds(post.getCreatedAt().toISOString())).toBe(
    removeSeconds(savedPost.getCreatedAt().toISOString())
  );
}

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  Context.postRepository = new InMemoryPostRepository();
  Context.logger = new LoggerSpy();
});

test('throws if user extraction fails', () => {
  Context.gateKeeper = new FailureGateKeeperStub();
  const uC = createUseCase();

  assertValidationErrorWithMessage(
    () => executeUseCase({ uC }),
    ERROR_INVALID_USER
  );
});

describe('throws with token-invalid error message', () => {
  test.each([[''], [null]])('when the token is %s', (token) => {
    const uC = createUseCase();

    assertValidationErrorWithMessage(
      () => executeUseCase({ uC, token: token as string }),
      ERROR_INVALID_TOKEN
    );
  });
});

describe('throws with post-invalid error message', () => {
  test.each([[''], [null]])('when the post id is %s', (postId) => {
    const uC = createUseCase();

    assertValidationErrorWithMessage(
      () => executeUseCase({ uC, postId }),
      ERROR_INVALID_POST_ID
    );
  });
});

test('gets saved post', async () => {
  const uC = createUseCase();
  const savedPost = createdSavedPost();
  await Context.postRepository.save(savedPost);

  const res = await executeUseCase({ uC });

  const expectedRes = createdExpectedRes(savedPost);
  res.createdAt = removeSeconds(res.createdAt);
  expect(res).toStrictEqual(expectedRes);
});

test('throws if post does not exist', async () => {
  Context.postRepository = new PostRepositoryNullStub();
  const uC = createUseCase();

  assertValidationErrorWithMessage(
    () => executeUseCase({ uC }),
    ERROR_INVALID_POST_ID
  );
});

test('logs info for happy path', async () => {
  const uC = createUseCase();
  const savedPost = createdSavedPost();
  await Context.postRepository.save(savedPost);

  await executeUseCase({ uC });

  const loggerSpy = Context.logger as LoggerSpy;

  expect(loggerSpy.logInfoCalls.length).toBe(2);
  expect(loggerSpy.logInfoCalls[0]).toEqual(['Extracted user from token']);
  expect(loggerSpy.logInfoCalls[1][0]).toEqual(`Fetched post using id`);
  const arg = loggerSpy.logInfoCalls[1][1] as { id: string; post: Post };
  expect(arg.id).toBe(savedPost.getId());
  assertPostEquality(arg.post, savedPost);
});
