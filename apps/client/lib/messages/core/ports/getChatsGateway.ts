import { Chat } from '../domain/chat';

export interface GetChatsGateway {
  getChats(offset: number): Promise<Chat[] | undefined>;
}
