import { Message } from '../domain/message';

export interface SendMessageGateway {
  sendMessage(text: string, chatId: string): Promise<Message | null>;
}
