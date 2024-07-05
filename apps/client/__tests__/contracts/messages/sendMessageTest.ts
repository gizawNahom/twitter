import { Pact } from '@pact-foundation/pact';
import { AnyTemplate, like } from '@pact-foundation/pact/src/dsl/matchers';
import {
  Operations,
  addInteraction,
  createBaseInteraction,
} from '../../testUtilities';
import { sampleMessageResponse } from '../../../mocks/values';
import { sendMessage } from '../../../utilities/sendMessage';

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
        .given('a chat with the chat id exists')
        .withVariables({
          text: like(sampleMessageResponse.text),
          chatId: like(sampleMessageResponse.chatId),
        });
      await addInteraction(provider, interaction);

      const message = await sendMessage(
        sampleMessageResponse.text,
        sampleMessageResponse.chatId
      );

      expect(message).toStrictEqual(sampleMessageResponse);
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
