import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { Pact } from '@pact-foundation/pact';
import {
  Operations,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import {
  sampleLimit,
  sampleOffset,
  sampleChatResponse,
  sampleInvalidOffset,
  sampleInvalidLimit,
  GENERIC_SERVER_ERROR,
} from '../../../mocks/values';
import { getChats } from '../../../lib/messages/adapters/api/getChats';

export function testGetChats(provider: Pact, baseUrl: URL) {
  describe('Get Chats', () => {
    test('gets chats', async () => {
      const validOffset = sampleOffset;
      const validLimit = sampleLimit;
      const interaction = createInteraction({
        data: {
          chats: [like(sampleChatResponse)],
        },
      })
        .uponReceiving('a request to fetch chats with a valid offset and limit')
        .given('a user has one or more chats')
        .withVariables({
          offset: like(validOffset),
          limit: like(validLimit),
        });
      await addInteraction(provider, interaction);

      const chats = await getChats(validOffset, validLimit);

      expect(chats).toStrictEqual([sampleChatResponse]);
    });

    test('handles error', async () => {
      const invalidOffset = sampleInvalidOffset;
      const invalidLimit = sampleInvalidLimit;
      const interaction = createInteraction({
        data: null,
        errors: [
          {
            message: like(GENERIC_SERVER_ERROR),
          },
        ],
      })
        .uponReceiving(
          'a request to fetch chats with an invalid offset and limit'
        )
        .withVariables({
          offset: like(invalidOffset),
          limit: like(invalidLimit),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await getChats(invalidOffset, invalidLimit);
      }).rejects.toThrow(new Error());
    });
  });

  function createInteraction(responseBody: AnyTemplate) {
    return createBaseInteraction(baseUrl, responseBody)
      .withOperation(Operations.GetChats)
      .withQuery(
        `query ${Operations.GetChats}($limit: Int!, $offset: Int!) {
          chats(limit: $limit, offset: $offset) {
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
