import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import {
  addInteraction,
  assertPostEquality,
  createBaseInteraction,
} from '../testUtilities/contractHelpers';
import { GENERIC_SERVER_ERROR, samplePostResponse } from '../../mocks/values';
import { fetchPosts } from '../../lib/redux/slices/postsSlice/fetchPosts';
import { Pact } from '@pact-foundation/pact';
import { Operations } from '../testUtilities/operations';

export function testFetchPosts(provider: Pact, baseUrl: URL) {
  describe('Fetches created posts', () => {
    test('paginates created posts', async () => {
      const validOffset = 0;
      const validLimit = 10;
      const interaction = createInteraction({
        data: {
          posts: [
            {
              id: like(samplePostResponse.id),
              text: like(samplePostResponse.text),
              userId: like(samplePostResponse.userId),
              createdAt: like(samplePostResponse.createdAt),
              __typename: like(samplePostResponse.__typename),
            },
          ],
        },
      })
        .uponReceiving(
          'a request to fetch created posts with valid id, offset and limit'
        )
        .given('a user has created a post')
        .withVariables({
          userId: like(samplePostResponse.userId),
          offset: like(validOffset),
          limit: like(validLimit),
        });
      await addInteraction(provider, interaction);

      const posts = await fetchPosts(
        samplePostResponse.userId,
        validOffset,
        validLimit
      );

      expect(posts.length).toBe(1);
      assertPostEquality(posts[0]);
    });

    test('handles error', async () => {
      const invalidUserId = '';
      const invalidOffset = -1;
      const invalidLimit = -10;
      const interaction = createInteraction({
        data: {
          posts: null,
        },
        errors: [
          {
            message: like(GENERIC_SERVER_ERROR),
          },
        ],
      })
        .uponReceiving(
          'a request to fetch created posts with invalid id, offset and limit'
        )
        .withVariables({
          userId: like(invalidUserId),
          offset: like(invalidOffset),
          limit: like(invalidLimit),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await fetchPosts(invalidUserId, invalidOffset, invalidLimit);
      }).rejects.toThrow(new Error());
    });

    function createInteraction(responseBody: AnyTemplate) {
      return createBaseInteraction(baseUrl, responseBody)
        .withOperation(Operations.Posts)
        .withQuery(
          `
        query Posts($userId: ID!, $offset: Int!, $limit: Int!) {
          posts(userId: $userId, offset: $offset, limit: $limit) {
            id
            text
            userId
            createdAt
            __typename
          }
        }
      `
        );
    }
  });
}
