import { Chat } from '../domain/chat';

export interface GetChatsGateway {
  getChats(): Promise<Chat[] | undefined>;
}
