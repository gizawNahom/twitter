import { gql } from '@apollo/client';
import { Message } from './core/domain/message';
import { Client } from '../../utilities/client';

export async function readMessages(
  chatId: string,
  offset: number,
  limit: number
): Promise<Message[]> {
  try {
    const res = await Client.client.query({
      query: getQuery(),
      variables: getVariables(chatId, offset, limit),
    });

    return res.data.messages as Array<Message>;
  } catch (error) {
    throw new Error();
  }

  function getQuery() {
    return gql`
      query ReadMessages($chatId: String!, $limit: Int!, $offset: Int!) {
        messages(limit: $limit, offset: $offset, chatId: $chatId) {
          id
          senderId
          chatId
          text
          createdAt
        }
      }
    `;
  }

  function getVariables(chatId: string, offset: number, limit: number) {
    return {
      chatId,
      offset,
      limit,
    };
  }
}
