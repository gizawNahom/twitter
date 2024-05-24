import { Chat } from '../../src/core/entities/chat';
import { Message } from '../../src/core/entities/message';
import { MessageGateway } from '../../src/core/ports/messageGateway';
import { ChatId } from '../../src/core/valueObjects/chatId';

export class MessageGatewaySpy implements MessageGateway {
  savedMessage: Message;
  doesChatExistResponse = true;
  getCorrespondentIdCalls: { chatId: ChatId; userId: string }[] = [];
  getCorrespondentIdResponse = 'correspondentId1';
  saveChatCalls: { chat: Chat }[] = [];
  getChatResponse: Chat | null;
  getChatCalls: [string, string][] = [];

  async saveMessage(message: Message): Promise<void> {
    this.savedMessage = message;
  }

  async doesChatExist(): Promise<boolean> {
    return this.doesChatExistResponse;
  }

  async getCorrespondentId(chatId: ChatId, userId: string): Promise<string> {
    this.getCorrespondentIdCalls.push({ chatId, userId });
    return this.getCorrespondentIdResponse;
  }

  async saveChat(chat: Chat): Promise<void> {
    this.saveChatCalls.push({ chat });
  }

  async getChat(userId1: string, userId2: string): Promise<Chat | null> {
    this.getChatCalls.push([userId1, userId2]);
    return this.getChatResponse;
  }
}