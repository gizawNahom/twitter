import { ChatId } from '../valueObjects/chatId';
import { MessageText } from '../valueObjects/messageText';

export class Message {
  private id: string;
  private senderId: string;
  private chatId: ChatId;
  private text: MessageText;
  private createdAt: Date;

  constructor(
    id: string,
    senderId: string,
    chatId: ChatId,
    text: MessageText,
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
    return this.text.getText();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
