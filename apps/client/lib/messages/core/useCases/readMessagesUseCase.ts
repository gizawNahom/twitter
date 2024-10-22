import { Message } from '../domain/message';
import { ReadMessagesGateway } from '../ports/readMessagesGateway';

export class ReadMessagesUseCase {
  constructor(private gateway: ReadMessagesGateway) {}

  async execute(offset: number, chatId: string): Promise<Message[]> {
    return await this.gateway.readMessages(chatId);
  }
}
