import { Message } from '../domain/message';

export interface ReadMessagesGateway {
  readMessages(offset: number, chatId: string): Promise<Message[]>;
}
