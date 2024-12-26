import { Chat } from '../domain/chat';

export interface GetOrCreateChatGateway {
  getOrCreateChat(username: string): Promise<Chat | null>;
}
