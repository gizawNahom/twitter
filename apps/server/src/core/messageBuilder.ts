import { Message } from './entities/message';
import { ChatId } from './valueObjects/chatId';
import { MessageText } from './valueObjects/messageText';

export class MessageBuilder {
  private id: string;
  private senderId: string;
  private chatId: ChatId;
  private text: MessageText;
  private createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static message(): MessageBuilder {
    return new MessageBuilder();
  }

  withId(id: string) {
    this.id = id;
    return this;
  }

  withSenderId(senderId: string) {
    this.senderId = senderId;
    return this;
  }

  withChatId(chatId: ChatId) {
    this.chatId = chatId;
    return this;
  }

  withText(text: MessageText) {
    this.text = text;
    return this;
  }

  withCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
    return this;
  }

  build(): Message {
    return new Message(
      this.id,
      this.senderId,
      this.chatId,
      this.text,
      this.createdAt.toISOString()
    );
  }
}
