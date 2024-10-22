import { readMessages } from '../adapters/api/readMessages';
import { MessagesReader } from '../adapters/gateways/readMessagesGatewayImpl';
import { Message } from '../core/domain/message';

export class ApolloMessagesReader implements MessagesReader {
  readMessages(offset: number, chatId: string): Promise<Message[]> {
    return readMessages(chatId, 0, 3);
  }
}
