import { Message } from '../domain/message';
import { SendMessageGateway } from '../ports/sendMessageGateway';

export class SendMessageUseCase {
  constructor(private gateway: SendMessageGateway) {}

  async execute(text: string, chatId: string): Promise<Message | null> {
    return await this.gateway.sendMessage(text, chatId);
  }
}
