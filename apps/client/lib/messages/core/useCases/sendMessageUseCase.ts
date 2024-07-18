import { Message } from '../domain/message';
import { SendMessageDataSource } from '../ports/sendMessageDataSource';

export class SendMessageUseCase {
  constructor(private dataSource: SendMessageDataSource) {}

  async execute(text: string, chatId: string): Promise<Message | null> {
    return await this.dataSource.sendMessage(text, chatId);
  }
}
