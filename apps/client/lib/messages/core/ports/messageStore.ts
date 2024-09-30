import { Message } from '../domain/message';
import { CustomEvent } from '../../../shared/customEvent';

export interface MessageStore {
  readonly messagesUpdated: CustomEvent<Message[], string>;
}
