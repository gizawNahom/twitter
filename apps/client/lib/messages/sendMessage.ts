import { gql } from '@apollo/client';
import { Client } from '../../utilities/client';
import { Message } from './core/domain/message';

export async function sendMessage(
  text: string,
  chatId: string
): Promise<Message> {
  try {
    const res = await Client.client.mutate({
      mutation: getMutation(),
      variables: getVariables(text, chatId),
    });

    return res.data.sendMessage as Message;
  } catch (error) {
    throw new Error();
  }

  function getMutation() {
    return gql`
      mutation SendMessage($text: String!, $chatId: String!) {
        sendMessage(text: $text, chatId: $chatId) {
          id
          senderId
          chatId
          text
          createdAt
        }
      }
    `;
  }

  function getVariables(text: string, chatId: string) {
    return {
      text,
      chatId,
    };
  }
}
