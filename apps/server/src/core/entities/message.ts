import { ChatId } from '../valueObjects/chatId';

export class Message {
  private id: string;
  private senderId: string;
  private chatId: ChatId;
  private text: string;
  private createdAt: Date;

  constructor(
    id: string,
    senderId: string,
    chatId: ChatId,
    text: string,
    createdAtISO: string
  ) {
    this.id = id;
    this.senderId = senderId;
    this.chatId = chatId;
    this.text = text;
    this.createdAt = new Date(createdAtISO);
  }

  getId() {
    return this.id;
  }

  getSenderId() {
    return this.senderId;
  }

  getChatId(): ChatId {
    return this.chatId;
  }

  getText(): string {
    return this.text;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
