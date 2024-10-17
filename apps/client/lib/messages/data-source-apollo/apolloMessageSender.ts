import { ApolloCache, ApolloClient, DocumentNode, gql } from '@apollo/client';
import { MessageSender } from '../adapters/gateways/sendMessageGatewayImpl';
import { Message } from '../core/domain/message';
import { loadingMessagesVar } from '../../../utilities/client';
import { IdGenerator } from './idGenerator';

export class ApolloMessageSender implements MessageSender {
  constructor(
    private client: ApolloClient<object>,
    private idGenerator: IdGenerator
  ) {}

  async sendMessage(
    senderId: string,
    text: string,
    chatId: string
  ): Promise<Message> {
    try {
      return await this.trySendMessage(senderId, text, chatId);
    } catch (error) {
      throw new Error();
    }
  }

  private async trySendMessage(senderId: string, text: string, chatId: string) {
    const opRes = this.createOptimisticResponse(senderId, text, chatId);
    this.addToLoadingMessages(opRes);
    const res = await this.sendMessageWithOptimisticResponse(
      text,
      chatId,
      opRes
    );
    this.removeFromLoadingMessages(opRes);
    return res.data?.sendMessage as Message;
  }

  private createOptimisticResponse(
    senderId: string,
    text: string,
    chatId: string
  ): Message {
    const tempMessageId = this.idGenerator.generateId();
    const message = {
      id: tempMessageId,
      text,
      senderId,
      chatId: chatId as string,
      createdAt: new Date().toISOString(),
      __typename: 'Message',
    };
    return message;
  }

  private addToLoadingMessages(tempMsg: Message) {
    loadingMessagesVar([...loadingMessagesVar(), tempMsg.id]);
  }

  private async sendMessageWithOptimisticResponse(
    text: string,
    chatId: string,
    optimisticResponse: Message
  ) {
    return await this.client.mutate<{
      sendMessage: Message;
    }>({
      mutation: getMutation(),
      variables: getVariables(text, chatId),
      optimisticResponse: {
        sendMessage: optimisticResponse,
      },
      update(cache, { data }) {
        writeQuery(cache, chatId, data?.sendMessage as Message);
      },
    });

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

    function writeQuery(
      cache: ApolloCache<object>,
      chatId: string,
      message: Message
    ) {
      cache.writeQuery({
        ...buildMessagesQuery(chatId),
        data: {
          messages: [message],
        },
      });

      function buildMessagesQuery(chatId: string): {
        query: DocumentNode;
        variables: { chatId: string };
      } {
        return {
          query: gql`
            query ReadMessages($chatId: String!) {
              messages(chatId: $chatId) {
                id
                senderId
                chatId
                text
                createdAt
              }
            }
          `,
          variables: {
            chatId: chatId,
          },
        };
      }
    }
  }

  private removeFromLoadingMessages(tempMsg: Message) {
    loadingMessagesVar(loadingMessagesVar().filter((id) => id !== tempMsg.id));
  }
}
