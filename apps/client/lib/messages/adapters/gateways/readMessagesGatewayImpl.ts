import { Message } from '../../core/domain/message';
import { ReadMessagesGateway } from '../../core/ports/readMessagesGateway';

export class ReadMessagesGatewayImpl implements ReadMessagesGateway {
  constructor(private messagesReader: MessagesReader) {}

  async readMessages(chatId: string): Promise<Message[]> {
    return await this.messagesReader.readMessages(chatId);
  }
}

export interface MessagesReader {
  readMessages(chatId: string): Promise<Message[]>;
}
