import { Message } from '../../core/domain/message';
import { ReadMessagesGateway } from '../../core/ports/readMessagesGateway';
import { readMessages } from '../api/readMessages';

export class ReadMessagesImpl implements ReadMessagesGateway {
  async readMessages(chatId: string): Promise<Message[]> {
    return await readMessages(chatId as string, 0, 3);
  }
}
