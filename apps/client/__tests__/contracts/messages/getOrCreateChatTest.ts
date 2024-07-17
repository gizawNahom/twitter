import { Pact } from '@pact-foundation/pact';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import {
  Operations,
  USERNAME_EXISTS_STATE,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import {
  GENERIC_SERVER_ERROR,
  samplePartialChatResponse,
  sampleUserResponse,
} from '../../../mocks/values';
import { getOrCreateChat } from '../../../lib/messages/adapters/api/getOrCreateChat';

export function testGetOrCreateChat(provider: Pact, baseUrl: URL) {
  describe('Get Or Create Chat', () => {
    test('gets chat', async () => {
      const interaction = createInteraction({
        data: {
          chat: like(samplePartialChatResponse),
        },
      })
        .uponReceiving('a request to get or create chat with a valid username')
        .given(USERNAME_EXISTS_STATE)
        .withVariables({
          username: like(sampleUserResponse.username),
        });
      await addInteraction(provider, interaction);

      const chat = await getOrCreateChat(sampleUserResponse.username);

      expect(chat).toStrictEqual(samplePartialChatResponse);
    });
  });

  test('handles error', async () => {
    const invalidUsername = '1';
    const interaction = createInteraction({
      data: null,
      errors: [
        {
          message: like(GENERIC_SERVER_ERROR),
        },
      ],
    })
      .uponReceiving('a request to get or create chat with an invalid username')
      .withVariables({
        username: like(invalidUsername),
      });
    await addInteraction(provider, interaction);

    await expect(async () => {
      await getOrCreateChat(invalidUsername);
    }).rejects.toThrow(new Error());
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
