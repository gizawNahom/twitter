import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import { Pact } from '@pact-foundation/pact';
import {
  CHAT_ID_EXISTS_STATE,
  Operations,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import {
  GENERIC_SERVER_ERROR,
  sampleInvalidLimit,
  sampleInvalidOffset,
  sampleLimit,
  sampleMessageResponse,
  sampleOffset,
} from '../../../mocks/values';
import { readMessages } from '../../../lib/messages/adapters/api/readMessages';

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
        .given(CHAT_ID_EXISTS_STATE)
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

    test('handles error', async () => {
      const invalidChatId = '';
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
          'a request to fetch messages with an invalid chat id, offset and limit'
        )
        .withVariables({
          chatId: like(invalidChatId),
          offset: like(invalidOffset),
          limit: like(invalidLimit),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await readMessages(invalidChatId, invalidLimit, invalidOffset);
      }).rejects.toThrow(new Error());
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
