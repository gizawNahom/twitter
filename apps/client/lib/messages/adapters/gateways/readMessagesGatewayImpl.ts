import { Message } from '../../core/domain/message';
import { ReadMessagesGateway } from '../../core/ports/readMessagesGateway';

export class ReadMessagesGatewayImpl implements ReadMessagesGateway {
  constructor(private messagesReader: MessagesReader) {}

  async readMessages(
    offset: number,
    limit: number,
    chatId: string
  ): Promise<Message[]> {
    return await this.messagesReader.readMessages(offset, chatId);
  }
}

export interface MessagesReader {
  readMessages(offset: number, chatId: string): Promise<Message[]>;
}
