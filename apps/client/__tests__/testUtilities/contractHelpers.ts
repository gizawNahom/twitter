import { GraphQLInteraction, Pact } from '@pact-foundation/pact';
import { Post } from '../../lib/redux/slices/postsSlice/post';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { createSamplePost } from './helpers';

export function createBaseInteraction(baseUrl: URL, responseBody: AnyTemplate) {
  const PATH_NAME = baseUrl.pathname;

  return new GraphQLInteraction()
    .withRequest({
      path: PATH_NAME,
      method: 'POST',
      headers: {
        authorization: like('Bearer sampleUserToken'),
      },
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

export const USERNAME_EXISTS_STATE = 'a user with the username exists';

export const CHAT_ID_EXISTS_STATE = 'a chat with the chat id exists';
