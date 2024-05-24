import { Chat } from '../entities/chat';
import { Message } from '../entities/message';
import { ChatId } from '../valueObjects/chatId';

export interface MessageGateway {
  saveMessage(message: Message): Promise<void>;
  doesChatExist(chatId: ChatId): Promise<boolean>;
  getCorrespondentId(chatId: ChatId, userId: string): Promise<string>;
  saveChat(chat: Chat): Promise<void>;
  getChat(userId1: string, userId2: string): Promise<Chat | null>;
}
