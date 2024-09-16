import {
  ApolloCache,
  ApolloClient,
  DocumentNode,
  gql,
  Reference,
} from '@apollo/client';
import { MessageSender } from '../adapters/gateways/sendMessageGatewayImpl';
import { Message } from '../core/domain/message';
import { loadingMessagesVar } from '../../../utilities/client';

export class ApolloMessageSender implements MessageSender {
  constructor(private client: ApolloClient<object>) {}

  async sendMessage(text: string, chatId: string): Promise<Message> {
    try {
      return await this.trySendMessage(text, chatId);
    } catch (error) {
      throw new Error();
    }
  }

  private async trySendMessage(text: string, chatId: string) {
    const opRes = this.createOptimisticResponse(text, chatId);
    this.addToLoadingMessages(opRes);
    const res = await this.sendMessageWithOptimisticResponse(
      text,
      chatId,
      opRes
    );
    this.removeFromLoadingMessages(opRes);
    return res.data?.sendMessage as Message;
  }

  private createOptimisticResponse(text: string, chatId: string): Message {
    const tempMessageId = `${Math.floor(Math.random() * 100000)}`;
    const message = {
      id: tempMessageId,
      text,
      senderId: 'randomId1',
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
        updateCache(cache, data?.sendMessage as Message);
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

    function updateCache(cache: ApolloCache<object>, message: Message) {
      const newMessageRef = createNewMessageRef(cache, message);
      addToMessages(cache, newMessageRef);

      function createNewMessageRef(
        cache: ApolloCache<object>,
        sendMessage: Message
      ) {
        return cache.writeFragment({
          data: sendMessage,
          fragment: gql`
            fragment NewMessage on Message {
              id
              senderId
              chatId
              text
              createdAt
            }
          `,
        });
      }

      function addToMessages(
        cache: ApolloCache<object>,
        newMessageRef: Reference | undefined
      ) {
        const messagesQuery = buildMessagesQuery(chatId);
        const existingMessages = getExistingMessages(cache, messagesQuery);
        if (!existingMessages)
          initializeMessagesWithEmptyArray(cache, messagesQuery);
        modifyMessages(cache, newMessageRef);

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

        function getExistingMessages(
          cache: ApolloCache<object>,
          messagesQuery: {
            query: DocumentNode;
            variables: { chatId: string };
          }
        ) {
          return cache.readQuery(messagesQuery);
        }

        function initializeMessagesWithEmptyArray(
          cache: ApolloCache<object>,
          messagesQuery: {
            query: DocumentNode;
            variables: { chatId: string };
          }
        ) {
          cache.writeQuery({
            ...messagesQuery,
            data: {
              messages: [],
            },
          });
        }

        function modifyMessages(
          cache: ApolloCache<object>,
          newMessageRef: Reference | undefined
        ) {
          cache.modify({
            fields: {
              messages(existingMessages = []) {
                return [...existingMessages, newMessageRef];
              },
            },
          });
        }
      }
    }
  }

  private removeFromLoadingMessages(tempMsg: Message) {
    loadingMessagesVar(loadingMessagesVar().filter((id) => id !== tempMsg.id));
  }
}
