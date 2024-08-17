import { ApolloClient, gql, Reference, StoreObject } from '@apollo/client';
import { sendMessage } from '../adapters/api/sendMessage';
import { MessageSender } from '../adapters/gateways/sendMessageGatewayImpl';
import { Message } from '../core/domain/message';

export class ApolloMessageSender implements MessageSender {
  constructor(private client: ApolloClient<object>) {}

  async sendMessage(text: string, chatId: string): Promise<Message> {
    const tmpMsg = this.createTemporaryMessage(text, chatId);
    this.addTemporaryMessageToCache(tmpMsg);
    const sentMsg = await sendMessage(text, chatId);
    this.replaceTemporaryMessageWithSentMessage(tmpMsg.id, sentMsg);
    return sentMsg;
  }

  private createTemporaryMessage(text: string, chatId: string) {
    const tempMessageId = `${Math.floor(Math.random() * 100000)}`;
    const message = {
      id: tempMessageId,
      text,
      senderId: 'randomId1',
      chatId: chatId as string,
      createdAt: new Date().toISOString(),
      isLoading: true,
    };
    return message;
  }

  private addTemporaryMessageToCache(tmpMsg: Message) {
    this.client.cache.writeQuery({
      query: gql`
        query ReadMessages($chatId: ID) {
          messages(chatId: $chatId) {
            id
            senderId
            chatId
            text
            createdAt
            isLoading
          }
        }
      `,
      variables: {
        chatId: tmpMsg?.chatId,
      },
      data: {
        messages: [tmpMsg],
      },
    });
  }

  private replaceTemporaryMessageWithSentMessage(
    tempMsgId: string,
    sentMessage: Message
  ) {
    this.client.cache.modify({
      fields: {
        messages(existingMessages = [], { readField }) {
          const filtered = existingMessages.filter(
            (messageRef: Reference | StoreObject | undefined) =>
              readField('id', messageRef) !== tempMsgId
          );
          return [...filtered, sentMessage];
        },
      },
    });
  }
}
