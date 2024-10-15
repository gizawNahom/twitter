import { ApolloClient, gql } from '@apollo/client';
import { Message } from '../core/domain/message';
import { CustomEvent, EventHandler } from '../../shared/customEvent';

export const READ_MESSAGES_QUERY = gql`
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
  private subscribers: Map<string, number> = new Map();

  constructor(private client: ApolloClient<object>) {
    super();
  }

  add(handler: EventHandler<Message[]>, chatId: string) {
    super.add(handler, chatId);
    this.incrementSubscribers(chatId);
    this.subscribeToMessages(chatId);
  }

  private incrementSubscribers(chatId: string) {
    if (this.subscribers.has(chatId)) {
      this.subscribers.set(chatId, this.getSubscribers(chatId) + 1);
    } else {
      this.subscribers.set(chatId, 1);
    }
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

  remove(handler: EventHandler<Message[]>, chatId: string) {
    super.remove(handler, chatId);
    this.decrementSubscribers(chatId);
    this.unsubscribeFromMessages(chatId);
  }

  private decrementSubscribers(chatId: string) {
    if (this.subscribers.has(chatId)) {
      const currentCount = this.getSubscribers(chatId);
      if (currentCount > 0) {
        this.subscribers.set(chatId, currentCount - 1);
      }
    }
  }

  private unsubscribeFromMessages(chatId: string) {
    const subscription = this.subscriptions.get(chatId);
    if (subscription && this.getSubscribers(chatId) == 0) {
      subscription.unsubscribe();
      this.subscriptions.delete(chatId);
    }
  }

  private getSubscribers(chatId: string): number {
    return this.subscribers.get(chatId) || 0;
  }
}
