import { ApolloClient, gql } from '@apollo/client';
import { Message } from '../core/domain/message';

type EventHandler<T = unknown> = (param: T) => void;

class CustomEvent<T = unknown> {
  private handlers: EventHandler<T>[] = [];
  private subscribeFn: (chatId: string) => void;
  private unsubscribeFn: (chatId: string) => void;

  constructor(
    subscribeFn: (chatId: string) => void,
    unsubscribeFn: (chatId: string) => void
  ) {
    this.subscribeFn = subscribeFn;
    this.unsubscribeFn = unsubscribeFn;
  }

  add(handler: EventHandler<T>, chatId: string) {
    this.handlers.push(handler);
    this.subscribeFn(chatId);
  }

  remove(handler: EventHandler<T>, chatId: string) {
    this.handlers = this.handlers.filter((h) => h !== handler);
    this.unsubscribeFn(chatId);
  }

  dispatch(param: T) {
    this.handlers.forEach((handler) => handler(param));
  }
}

const READ_MESSAGES = gql`
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

export interface MessageStore {
  messagesUpdated: CustomEvent<Message[]>;
}

export class ApolloMessageStore implements MessageStore {
  private client: ApolloClient<object>;
  public messagesUpdated: CustomEvent<Message[]>;

  private subscriptions: Map<string, { unsubscribe: () => void }> = new Map();

  constructor(client: ApolloClient<object>) {
    this.client = client;
    this.messagesUpdated = new CustomEvent<Message[]>(
      this.subscribeToMessages.bind(this),
      this.unsubscribeFromMessages.bind(this)
    );
  }

  private subscribeToMessages(chatId: string) {
    if (!this.subscriptions.has(chatId)) {
      const observable = this.client.watchQuery({
        query: READ_MESSAGES,
        variables: { chatId },
        fetchPolicy: 'cache-only',
      });

      const subscription = observable.subscribe({
        next: ({ data: { messages } }) => {
          this.messagesUpdated.dispatch(messages);
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
