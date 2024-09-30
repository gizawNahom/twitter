import { Message } from '../core/domain/message';
import { MessageStore } from '../core/ports/messageStore';
import { CustomEvent } from '../../shared/customEvent';
import { Client } from '../../../utilities/client';
import { ApolloMessagesUpdated } from '../data-source-apollo/apolloMessagesUpdated';

export class MessageStoreImpl implements MessageStore {
  constructor(private _messagesUpdated: CustomEvent<Message[], string>) {}

  get messagesUpdated(): CustomEvent<Message[], string> {
    return this._messagesUpdated;
  }
}

export function buildMessageStore(): MessageStore {
  return new MessageStoreImpl(new ApolloMessagesUpdated(Client.client));
}
