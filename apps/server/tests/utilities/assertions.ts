import { ValidationError } from '../../src/core/errors';
import { Post } from '../../src/core/entities/post';
import { removeSeconds } from './helpers';
import { LOG_EXTRACTED_USER } from './logMessages';
import { DefaultGateKeeper } from '../../src/defaultGateKeeper';

export async function assertValidationErrorWithMessage(
  task: () => unknown,
  errorMessage: string
) {
  await expect(task()).rejects.toThrow(errorMessage);
  await expect(task()).rejects.toThrow(ValidationError);
}

export function assertPostEquality(post1: Post, post2: Post) {
  expect(post1.getId()).toBe(post2.getId());
  expect(post1.getText()).toBe(post2.getText());
  expect(post1.getUserId()).toBe(post2.getUserId());
  expect(removeSeconds(post1.getCreatedAt().toISOString())).toBe(
    removeSeconds(post2.getCreatedAt().toISOString())
  );
}

export function assertUserExtractionLog(arg: unknown[]) {
  expect(arg[0]).toEqual(LOG_EXTRACTED_USER);
  expect(arg[1]).toStrictEqual({
    userId: DefaultGateKeeper.defaultUser.getId(),
  });
}

export function assertPostResponseMatchesPostEntity(postResponse, post: Post) {
  postResponse.createdAt = removeSeconds(postResponse.createdAt);
  expect(postResponse).toStrictEqual({
    id: post.getId(),
    text: post.getText(),
    createdAt: removeSeconds(post.getCreatedAt().toISOString()),
    userId: post.getUserId(),
  });
}

export function assertLogInfoCall({
  call,
  message,
  obj,
}: {
  call: Array<unknown>;
  message: string;
  obj;
}) {
  expect(call[0]).toBe(message);
  expect(call[1]).toStrictEqual(obj);
}
