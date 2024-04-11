import { like, AnyTemplate } from '@pact-foundation/pact/src/dsl/matchers';
import { GENERIC_SERVER_ERROR, samplePostResponse } from '../../mocks/values';
import { fetchPost } from '../../lib/redux/slices/postsSlice/fetchPost';
import { Pact } from '@pact-foundation/pact';
import {
  Operations,
  addInteraction,
  assertPostEquality,
  createBaseInteraction,
} from '../testUtilities';

export function testFetchPost(provider: Pact, baseUrl: URL) {
  describe('Fetch Post', () => {
    test('fetches post', async () => {
      const interaction = createInteraction({
        data: {
          post: {
            id: like(samplePostResponse.id),
            text: like(samplePostResponse.text),
            userId: like(samplePostResponse.userId),
            createdAt: like(samplePostResponse.createdAt),
            __typename: like(samplePostResponse.__typename),
          },
        },
      })
        .uponReceiving('a request to fetch a post with a valid post id')
        .given('a post with the id exists')
        .withVariables({
          id: like(samplePostResponse.id),
        });
      await addInteraction(provider, interaction);

      const post = await fetchPost(samplePostResponse.id);

      assertPostEquality(post);
    });

    test('handles error', async () => {
      const invalidPostId = '';
      const interaction = createInteraction({
        data: {
          post: null,
        },
        errors: [
          {
            message: like(GENERIC_SERVER_ERROR),
          },
        ],
      })
        .uponReceiving('a request to fetch a post with an invalid post id')
        .withVariables({
          id: like(invalidPostId),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await fetchPost(invalidPostId);
      }).rejects.toThrow();
    });

    function createInteraction(responseBody: AnyTemplate) {
      return createBaseInteraction(baseUrl, responseBody)
        .withOperation(Operations.Post)
        .withMutation(
          `query post($id: ID!) {
            post(id: $id) {
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
