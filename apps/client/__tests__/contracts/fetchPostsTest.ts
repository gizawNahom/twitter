import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import {
  addInteraction,
  assertPostEquality,
  createBaseInteraction,
} from '../utilities/contractHelpers';
import { GENERIC_SERVER_ERROR, samplePostResponse } from '../../mocks/values';
import { fetchPosts } from '../../lib/redux/slices/postsSlice/fetchPosts';
import { Pact } from '@pact-foundation/pact';
import { Operations } from '../utilities/operations';

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
        .withVariables({
          id: like(samplePostResponse.id),
          offset: like(validOffset),
          limit: like(validLimit),
        });
      await addInteraction(provider, interaction);

      const posts = await fetchPosts(
        samplePostResponse.id,
        validOffset,
        validLimit
      );

      expect(posts.length).toBe(1);
      assertPostEquality(posts[0]);
    });

    test('handles error', async () => {
      const invalidId = '';
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
          id: like(invalidId),
          offset: like(invalidOffset),
          limit: like(invalidLimit),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await fetchPosts(invalidId, invalidOffset, invalidLimit);
      }).rejects.toThrow(new Error());
    });

    function createInteraction(responseBody: AnyTemplate) {
      return createBaseInteraction(baseUrl, responseBody)
        .withOperation(Operations.Posts)
        .withQuery(
          `
        query Posts($id: ID!, $offset: Int, $limit: Int) {
          posts(id: $id, offset: $offset, limit: $limit) {
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
