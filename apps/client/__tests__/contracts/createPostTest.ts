import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import {
  addInteraction,
  assertPostEquality,
  createBaseInteraction,
} from '../testUtilities/contractHelpers';
import { GENERIC_SERVER_ERROR, samplePostResponse } from '../../mocks/values';
import { createPost } from '../../lib/redux/slices/postsSlice/createPost';
import { Pact } from '@pact-foundation/pact';
import { Operations } from '../testUtilities/operations';

export function testCreatePost(provider: Pact, baseUrl: URL) {
  describe('Create Post', () => {
    test('creates post', async () => {
      const interaction = createInteraction({
        data: {
          createPost: {
            id: like(samplePostResponse.id),
            text: like(samplePostResponse.text),
            userId: like(samplePostResponse.userId),
            createdAt: like(samplePostResponse.createdAt),
            __typename: like(samplePostResponse.__typename),
          },
        },
      })
        .uponReceiving('a request to create a post with a valid text')
        .withVariables({
          text: like(samplePostResponse.text),
        });
      await addInteraction(provider, interaction);

      const [post, errors] = await createPost(samplePostResponse.text);

      expect(errors).toBe(null);
      assertPostEquality(post);
    });

    test('handles error', async () => {
      const invalidText = '';
      const interaction = createInteraction({
        data: {
          createPost: null,
        },
        errors: [
          {
            message: like(GENERIC_SERVER_ERROR),
          },
        ],
      })
        .uponReceiving('a request to create a post with an invalid text')
        .withVariables({
          text: like(invalidText),
        });
      await addInteraction(provider, interaction);

      const [post, errors] = await createPost(invalidText);

      expect(errors).not.toBe(null);
      expect(errors?.length).toBe(1);
      expect((errors as string[])[0]).toBe(GENERIC_SERVER_ERROR);
      expect(post).toBe(null);
    });

    function createInteraction(responseBody: AnyTemplate) {
      return createBaseInteraction(baseUrl, responseBody)
        .withOperation(Operations.CreatePost)
        .withMutation(
          `mutation createPost($text: String!) {
            createPost(text: $text) {
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
