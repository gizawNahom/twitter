import { InMemoryPostRepository } from '../../src/adapter-persistance-inMemory/InMemoryPostRepository';
import Context from '../../src/context';
import {
  GetPostUseCase,
  GetPostUseCaseResponse,
} from '../../src/core/useCases/getPostUseCase';
import { Post } from '../../src/core/entities/post';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';
import { LoggerSpy } from '../doubles/loggerSpy';
import { PostRepositoryNullStub } from '../doubles/postRepositoryNullStub';
import { FailureGateKeeperStub } from '../doubles/FailureGateKeeperStub';
import {
  ERROR_INVALID_POST_ID,
  ERROR_INVALID_USER,
} from '../utilities/errorMessages';
import { removeSeconds } from '../utilities/helpers';
import {
  assertPostEquality,
  assertValidationErrorWithMessage,
} from '../utilities/assertions';
import { sampleUserToken } from '../utilities/samples';
import { testInvalidToken } from '../utilities/tests';
import {
  LOG_FETCHED_POST_WITH_ID,
  LOG_EXTRACTED_USER,
} from '../utilities/logMessages';

const samplePostId = 'postId1';

async function executeUseCase({
  token = sampleUserToken,
  postId = samplePostId,
}: {
  token?: string;
  postId?: string | null;
}) {
  const uC = new GetPostUseCase(
    Context.logger,
    Context.gateKeeper,
    Context.postRepository
  );
  return await uC.execute(token, postId);
}

function createdSavedPost() {
  const savedPost = new Post();
  savedPost.setId(samplePostId);
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

beforeEach(() => {
  Context.gateKeeper = new DefaultGateKeeper();
  Context.postRepository = new InMemoryPostRepository();
  Context.logger = new LoggerSpy();
});

test('throws if user extraction fails', () => {
  Context.gateKeeper = new FailureGateKeeperStub();

  assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_INVALID_USER
  );
});

testInvalidToken((token) => executeUseCase({ token }));

describe('throws with post-invalid error message', () => {
  test.each([[''], [null]])('when the post id is %s', (postId) => {
    assertValidationErrorWithMessage(
      () => executeUseCase({ postId }),
      ERROR_INVALID_POST_ID
    );
  });
});

test('gets saved post', async () => {
  const savedPost = createdSavedPost();
  await Context.postRepository.save(savedPost);

  const res = await executeUseCase({});

  const expectedRes = createdExpectedRes(savedPost);
  res.createdAt = removeSeconds(res.createdAt);
  expect(res).toStrictEqual(expectedRes);
});

test('throws if post does not exist', async () => {
  Context.postRepository = new PostRepositoryNullStub();

  assertValidationErrorWithMessage(
    () => executeUseCase({}),
    ERROR_INVALID_POST_ID
  );
});

test('logs info for happy path', async () => {
  const savedPost = createdSavedPost();
  await Context.postRepository.save(savedPost);

  await executeUseCase({});

  const loggerSpy = Context.logger as LoggerSpy;

  expect(loggerSpy.logInfoCalls.length).toBe(2);
  expect(loggerSpy.logInfoCalls[0][0]).toEqual(LOG_EXTRACTED_USER);
  expect(loggerSpy.logInfoCalls[0][1]).toStrictEqual({
    userId: DefaultGateKeeper.defaultUser.getId(),
  });
  expect(loggerSpy.logInfoCalls[1][0]).toEqual(LOG_FETCHED_POST_WITH_ID);
  const arg = loggerSpy.logInfoCalls[1][1] as { id: string; post: Post };
  expect(arg.id).toBe(savedPost.getId());
  assertPostEquality(arg.post, savedPost);
});
