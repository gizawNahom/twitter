import { Message } from '../domain/message';

export interface SendMessageGateway {
  sendMessage(senderId: string, text: string, chatId: string): Promise<Message>;
}
