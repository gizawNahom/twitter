import { ApolloClient, gql } from '@apollo/client';
import { Message } from '../core/domain/message';
import { CustomEvent, EventHandler } from '../../shared/customEvent';

const READ_MESSAGES_QUERY = gql`
  query ReadMessages($chatId: ID) {
    messages(chatId: $chatId) {
      id
      senderId
      chatId
      text
      createdAt
      isLoading @client
    }
  }
`;

export class ApolloMessagesUpdated extends CustomEvent<Message[], string> {
  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();

  constructor(private client: ApolloClient<object>) {
    super();
  }

  add(handler: EventHandler<Message[]>, chatId: string) {
    super.add(handler, chatId);
    this.subscribeToMessages(chatId);
  }
  remove(handler: EventHandler<Message[]>, chatId: string) {
    super.remove(handler, chatId);
    this.unsubscribeFromMessages(chatId);
  }

  private subscribeToMessages(chatId: string) {
    if (!this.subscriptions.has(chatId)) {
      const observable = this.client.watchQuery({
        query: READ_MESSAGES_QUERY,
        variables: { chatId },
        fetchPolicy: 'cache-only',
      });

      const subscription = observable.subscribe({
        next: ({ data: { messages } }) => {
          super.dispatch(messages, chatId);
        },
      });

      this.subscriptions.set(chatId, subscription);
    }
  }

  private unsubscribeFromMessages(chatId: string) {
    const subscription = this.subscriptions.get(chatId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(chatId);
    }
  }
}
