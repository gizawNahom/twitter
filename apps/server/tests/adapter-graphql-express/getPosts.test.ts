import Context from '../../src/context';
import { assertPostResponseMatchesPostEntity } from '../utilities/assertions';
import { ERROR_INVALID_LIMIT } from '../utilities/errorMessages';
import { sendRequest } from '../utilities/helpers';
import { samplePost, sampleUserId } from '../utilities/samples';
import {
  testWithExpectedError,
  testWithUnExpectedError,
} from '../utilities/tests';

async function sendGetPostsRequest(limit = 1) {
  const query = `query Posts($userId: ID!, $limit: Int!, $offset: Int!) {
    posts(userId: $userId, limit: $limit, offset: $offset) {
      id
      text
      userId
      createdAt
    }
  }`;
  const variables = { userId: sampleUserId, limit, offset: 0 };
  const res = await sendRequest(query, variables);
  return res;
}

test('gets posts', async () => {
  await Context.postRepository.save(samplePost);

  const res = await sendGetPostsRequest();

  expect(res.status).toBe(200);
  expect(res.body.data.posts).toHaveLength(1);
  assertPostResponseMatchesPostEntity(res.body.data.posts[0], samplePost);
});

testWithExpectedError(
  async () => await sendGetPostsRequest(-1),
  ERROR_INVALID_LIMIT
);

testWithUnExpectedError(async () => await sendGetPostsRequest());
