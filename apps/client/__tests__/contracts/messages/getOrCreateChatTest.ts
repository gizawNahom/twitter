import { Pact } from '@pact-foundation/pact';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import {
  Operations,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import { sampleChatResponse, sampleUserResponse } from '../../../mocks/values';
import { getOrCreateChat } from '../../../utilities/getOrCreateChat';

export function testGetOrCreateChat(provider: Pact, baseUrl: URL) {
  describe('Get Or Create Chat', () => {
    test('gets chat', async () => {
      const interaction = createInteraction({
        data: {
          chat: like(sampleChatResponse),
        },
      })
        .uponReceiving('a request to get or create chat with a valid username')
        .withVariables({
          username: like(sampleUserResponse.username),
        });
      await addInteraction(provider, interaction);

      const chat = await getOrCreateChat(sampleUserResponse.username);

      expect(chat).toStrictEqual(sampleChatResponse);
    });
  });

  function createInteraction(responseBody: AnyTemplate) {
    return createBaseInteraction(baseUrl, responseBody)
      .withOperation(Operations.GetOrCreateChat)
      .withMutation(
        `mutation ${Operations.GetOrCreateChat}($username: String!) {
          chat(username: $username) {
            id
            createdAt
            __typename
          }
        }`
      );
  }
}
