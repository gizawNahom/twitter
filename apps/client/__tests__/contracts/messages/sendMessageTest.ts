import { Pact } from '@pact-foundation/pact';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import {
  CHAT_ID_EXISTS_STATE,
  Operations,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import {
  GENERIC_SERVER_ERROR,
  sampleMessageResponse,
} from '../../../mocks/values';
import { Context } from '../../../lib/messages/context';

async function sendRequest(text: string, chatId: string) {
  return await Context.messageSender.sendMessage(
    sampleMessageResponse.senderId,
    text,
    chatId
  );
}

export function testSendMessage(provider: Pact, baseUrl: URL) {
  describe('Send Message', () => {
    test('sends message', async () => {
      const interaction = createInteraction({
        data: {
          sendMessage: like(sampleMessageResponse),
        },
      })
        .uponReceiving(
          'a request to send a message with a valid text and a valid chatId'
        )
        .given(CHAT_ID_EXISTS_STATE)
        .withVariables({
          text: like(sampleMessageResponse.text),
          chatId: like(sampleMessageResponse.chatId),
        });
      await addInteraction(provider, interaction);

      const message = await sendRequest(
        sampleMessageResponse.text,
        sampleMessageResponse.chatId
      );

      expect(message).toStrictEqual(sampleMessageResponse);
    });

    test('handles error', async () => {
      const invalidText = '';
      const invalidChatId = '';
      const interaction = createInteraction({
        data: {
          sendMessage: null,
        },
        errors: [
          {
            message: like(GENERIC_SERVER_ERROR),
          },
        ],
      })
        .uponReceiving(
          'a request to send a message with an invalid text and an invalid chatId'
        )
        .withVariables({
          text: like(invalidText),
          chatId: like(invalidChatId),
        });
      await addInteraction(provider, interaction);

      await expect(async () => {
        await sendRequest(invalidText, invalidChatId);
      }).rejects.toThrow(new Error());
    });
  });

  function createInteraction(responseBody: AnyTemplate) {
    return createBaseInteraction(baseUrl, responseBody)
      .withOperation(Operations.SendMessage)
      .withMutation(
        `mutation ${Operations.SendMessage}($text: String!, $chatId: String!) {
          sendMessage(text: $text, chatId: $chatId) {
            id
            senderId
            chatId
            text
            createdAt
            __typename
          }
        }`
      );
  }
}
