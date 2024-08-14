import { Message } from '../domain/message';

export interface ReadMessagesGateway {
  readMessages(chatId: string): Promise<Message[]>;
}
