import { Chat } from '../domain/chat';

export interface GetChatsGateway {
  getChats(offset: number, limit: number): Promise<Chat[]>;
}
