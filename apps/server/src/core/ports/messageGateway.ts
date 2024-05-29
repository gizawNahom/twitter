import { Chat } from '../entities/chat';
import { Message } from '../entities/message';
import { ChatId } from '../valueObjects/chatId';
import { Limit } from '../valueObjects/limit';
import { Offset } from '../valueObjects/offset';

export interface MessageGateway {
  saveMessage(message: Message): Promise<void>;
  doesChatExist(chatId: ChatId): Promise<boolean>;
  getCorrespondentId(chatId: ChatId, userId: string): Promise<string>;
  saveChat(chat: Chat): Promise<void>;
  getChat(userId1: string, userId2: string): Promise<Chat | null>;
  getChats(userId: string, limit: Limit, offset: Offset): Promise<Array<Chat>>;
  getChatWithId(chatId: ChatId): Promise<Chat | null>;
  getMessages(
    chatId: ChatId,
    limit: Limit,
    offset: Offset
  ): Promise<Array<Message>>;
}
