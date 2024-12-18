import { gql } from '@apollo/client';
import { MessagesReader } from '../adapters/gateways/readMessagesGatewayImpl';
import { Message } from '../core/domain/message';
import { Client, EndOfListError } from '../../../utilities/client';

export class ApolloMessagesReader implements MessagesReader {
  async readMessages(
    offset: number,
    limit: number,
    chatId: string
  ): Promise<Message[]> {
    try {
      const res = await Client.client.query({
        query: getQuery(),
        variables: getVariables(chatId, offset, limit),
        fetchPolicy: 'network-only',
      });
      return res.data.messages as Array<Message>;
    } catch (error) {
      if (error instanceof EndOfListError) throw error;
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
}
