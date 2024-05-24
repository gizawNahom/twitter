import { ChatId } from '../valueObjects/chatId';

export class Chat {
  private id: ChatId;
  private createdAt: Date;
  private participants: [string, string];

  constructor(id: ChatId, participants: [string, string], createdAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.participants = participants;
  }

  getId(): string {
    return this.id.getId();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getParticipants(): [string, string] {
    return this.participants;
  }
}
