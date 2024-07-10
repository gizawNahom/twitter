import { gql } from '@apollo/client';
import { Client } from './client';

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

export interface Message {
  id: string;
  senderId: string;
  chatId: string;
  text: string;
  createdAt: string;
}
