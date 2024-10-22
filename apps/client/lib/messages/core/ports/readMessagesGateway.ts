import { Message } from '../domain/message';

export interface ReadMessagesGateway {
  readMessages(
    offset: number,
    limit: number,
    chatId: string
  ): Promise<Message[]>;
}
