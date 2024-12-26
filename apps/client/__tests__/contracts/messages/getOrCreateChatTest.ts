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
  sampleChatResponse,
  sampleUserResponse,
} from '../../../mocks/values';
import { getOrCreateChat } from '../../../lib/messages/adapters/api/getOrCreateChat';

async function sendRequest(username: string) {
  return await getOrCreateChat(username);
}

export function testGetOrCreateChat(provider: Pact, baseUrl: URL) {
  describe('Get Or Create Chat', () => {
    test('gets chat', async () => {
      const interaction = createInteraction({
        data: {
          chat: like(sampleChatResponse),
        },
      })
        .uponReceiving('a request to get or create chat with a valid username')
        .given(USERNAME_EXISTS_STATE)
        .withVariables({
          username: like(sampleUserResponse.username),
        });
      await addInteraction(provider, interaction);

      const chat = await sendRequest(sampleUserResponse.username);

      expect(chat).toStrictEqual(sampleChatResponse);
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
      await sendRequest(invalidUsername);
    }).rejects.toThrow(new Error());
  });

  function createInteraction(responseBody: AnyTemplate) {
    return createBaseInteraction(baseUrl, responseBody)
      .withOperation(Operations.GetOrCreateChat)
      .withMutation(
        `mutation ${Operations.GetOrCreateChat}($username: String!) {
          chat(username: $username) {
            id
            createdAtISO
            participant {
              username
              displayName
              profilePic
              __typename
            }
            __typename
          }
        }`
      );
  }
}
