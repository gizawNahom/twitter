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
} from '../../../mocks/values';
import { getChats } from '../../../utilities/getChats';

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
