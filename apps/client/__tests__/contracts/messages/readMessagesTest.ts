import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { Pact } from '@pact-foundation/pact';
import {
  Operations,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import {
  sampleLimit,
  sampleMessageResponse,
  sampleOffset,
} from '../../../mocks/values';
import { readMessages } from '../../../utilities/readMessages';

export async function testReadMessages(provider: Pact, baseUrl: URL) {
  describe('Read messages', () => {
    test('reads messages', async () => {
      const validOffset = sampleOffset;
      const validLimit = sampleLimit;
      const interaction = createInteraction({
        data: {
          messages: [like(sampleMessageResponse)],
        },
      })
        .uponReceiving(
          'a request to fetch messages with a valid chatId, offset and limit'
        )
        .given('a chat with the chat id exists')
        .withVariables({
          chatId: like(sampleMessageResponse.chatId),
          offset: like(validOffset),
          limit: like(validLimit),
        });
      await addInteraction(provider, interaction);

      const messages = await readMessages(
        sampleMessageResponse.chatId,
        validOffset,
        validLimit
      );

      expect(messages).toStrictEqual([sampleMessageResponse]);
    });
  });

  function createInteraction(responseBody: AnyTemplate) {
    return createBaseInteraction(baseUrl, responseBody)
      .withOperation(Operations.ReadMessages)
      .withQuery(
        `
          query ${Operations.ReadMessages}($chatId: String!, $limit: Int!, $offset: Int!) {
            messages(limit: $limit, offset: $offset, chatId: $chatId) {
              id
              senderId
              chatId
              text
              createdAt
              __typename
            }
          }
          `
      );
  }
}
