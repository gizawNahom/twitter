import { readMessages } from '../adapters/api/readMessages';
import { MessagesReader } from '../adapters/gateways/readMessagesGatewayImpl';
import { Message } from '../core/domain/message';

export class ApolloMessagesReader implements MessagesReader {
  readMessages(
    offset: number,
    limit: number,
    chatId: string
  ): Promise<Message[]> {
    return readMessages(chatId, offset, limit);
  }
}
