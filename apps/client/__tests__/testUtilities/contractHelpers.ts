import { GraphQLInteraction, Pact } from '@pact-foundation/pact';
import { Post } from '../../lib/redux/slices/postsSlice/post';
import { AnyTemplate } from '@pact-foundation/pact/src/dsl/matchers';
import { createSamplePost } from './helpers';

export function createBaseInteraction(baseUrl: URL, responseBody: AnyTemplate) {
  const PATH_NAME = baseUrl.pathname;

  return new GraphQLInteraction()
    .withRequest({
      path: PATH_NAME,
      method: 'POST',
    })
    .willRespondWith({
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: responseBody,
    });
}

export async function addInteraction(
  provider: Pact,
  interaction: GraphQLInteraction
) {
  await provider.addInteraction(interaction);
}

export function assertPostEquality(post: Post | null) {
  expect(post).toEqual(createSamplePost());
}

export const POST_EXISTS_STATE = 'a user has created a post';
