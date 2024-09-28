import { ApolloClient, gql } from '@apollo/client';
import { Message } from '../core/domain/message';

type EventHandler<T = unknown> = (param: T) => void;

export class CustomEvent<T = unknown> {
  private handlers: Map<string, EventHandler<T>[]> = new Map();
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
    if (!this.handlers.has(chatId)) {
      this.handlers.set(chatId, []);
    }
    this.handlers.get(chatId)?.push(handler);
    this.subscribeFn(chatId);
  }

  remove(handler: EventHandler<T>, chatId: string) {
    if (this.handlers.has(chatId)) {
      const handlersForChat = this.handlers.get(chatId) as EventHandler<T>[];
      this.handlers.set(
        chatId,
        handlersForChat.filter((h) => h !== handler)
      );
      this.unsubscribeFn(chatId);
    }
  }

  dispatch(param: T, chatId: string) {
    if (this.handlers.has(chatId)) {
      const handlersForChat = this.handlers.get(chatId);
      handlersForChat?.forEach((handler) => handler(param));
    }
  }
}

// interface CustomEvent1<ResultType, ResultKey> {
//   add(handler: EventHandler<ResultType>, key?: ResultKey): void;
//   remove(handler: EventHandler<ResultType>, key?: ResultKey): void;
// }

export abstract class CustomEvent1<ResultType, ResultKey> {
  private handlers: Map<ResultKey, EventHandler<ResultType>[]> = new Map();

  add(handler: EventHandler<ResultType>, key: ResultKey) {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
    this.handlers.get(key)?.push(handler);
  }

  remove(handler: EventHandler<ResultType>, key: ResultKey) {
    if (this.handlers.has(key)) {
      const handlersForChat = this.handlers.get(
        key
      ) as EventHandler<ResultType>[];
      this.handlers.set(
        key,
        handlersForChat.filter((h) => h !== handler)
      );
    }
  }

  dispatch(param: ResultType, key: ResultKey) {
    if (this.handlers.has(key)) {
      const handlersForChat = this.handlers.get(key);
      handlersForChat?.forEach((handler) => handler(param));
    }
  }
}

class ApolloMessagesUpdated extends CustomEvent1<Message[], string> {
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
        query: READ_MESSAGES,
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
export interface MessageStore1 {
  messagesUpdated: CustomEvent1<Message[], string>;
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
          this.messagesUpdated.dispatch(messages, chatId);
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
export class ApolloMessageStore1 implements MessageStore1 {
  public messagesUpdated: CustomEvent1<Message[], string>;

  constructor(client: ApolloClient<object>) {
    this.messagesUpdated = new ApolloMessagesUpdated(client);
  }
}
