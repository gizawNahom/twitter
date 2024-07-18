import { Message } from '../domain/message';

export interface SendMessageDataSource {
  sendMessage(text: string, chatId: string): Promise<Message | null>;
}
