import { Pact } from '@pact-foundation/pact';
import { searchPosts } from '../../lib/redux/slices/postsSlice/searchPosts';
import {
  addInteraction,
  assertPostEquality,
  createBaseInteraction,
} from '../testUtilities/contractHelpers';
import { Operations } from '../testUtilities/operations';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { GENERIC_SERVER_ERROR, samplePostResponse } from '../../mocks/values';

async function executeSUT(query: string, offset: number, limit: number) {
  return await searchPosts(query, offset, limit);
}

export function testSearchPosts(provider: Pact, baseUrl: URL) {
  describe('Search Posts', () => {
    test('searches posts', async () => {
      const sampleQuery = 'hello';
      const validOffset = 0;
      const validLimit = 10;
      const interaction = createInteraction({
        data: {
          searchPosts: [
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
        .uponReceiving('a request to search posts with query, offset and limit')
        .given('there are saved posts')
        .withVariables({
          query: like(sampleQuery),
          offset: like(validOffset),
          limit: like(validLimit),
        });
      await addInteraction(provider, interaction);

      const posts = await executeSUT(sampleQuery, validOffset, validLimit);

      expect(posts.length).toBe(1);
      assertPostEquality(posts[0]);
    });

    test('handles error', async () => {
      const invalidQuery = '';
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
          'a request to search posts with invalid query, offset and limit'
        )
        .withVariables({
          query: like(invalidQuery),
          offset: like(invalidOffset),
          limit: like(invalidLimit),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await executeSUT(invalidQuery, invalidOffset, invalidLimit);
      }).rejects.toThrow(new Error());
    });

    function createInteraction(responseBody: AnyTemplate) {
      return createBaseInteraction(baseUrl, responseBody)
        .withOperation(Operations.SearchPosts)
        .withQuery(
          `query SearchPosts($query: String!, $limit: Int!, $offset: Int!) {
            searchPosts(query: $query, limit: $limit, offset: $offset) {
              id
              text
              userId
              createdAt
              __typename
            }
          }`
        );
    }
  });
}
