import { ApolloClient, gql } from '@apollo/client';
import { Message } from '../core/domain/message';
import { Client } from '../../../utilities/client';

export type EventHandler<T = unknown> = (param: T) => void;

export abstract class CustomEvent<ResultType, ResultKey> {
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
  readonly messagesUpdated: CustomEvent<Message[], string>;
}

export class MessageStoreImpl implements MessageStore {
  constructor(private _messagesUpdated: CustomEvent<Message[], string>) {}

  get messagesUpdated(): CustomEvent<Message[], string> {
    return this._messagesUpdated;
  }
}

export function buildMessageStore(): MessageStore {
  return new MessageStoreImpl(new ApolloMessagesUpdated(Client.client));
}
