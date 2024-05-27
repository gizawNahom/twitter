import { ChatId } from '../valueObjects/chatId';
import { User } from './user';

export class Chat {
  private id: ChatId;
  private createdAt: Date;
  private participants: [User, User];

  constructor(id: ChatId, participants: [User, User], createdAt: Date) {
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

  getParticipants(): [User, User] {
    return this.participants;
  }
}
