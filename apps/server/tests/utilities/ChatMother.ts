import { DefaultGateKeeper } from '../../src/adapter-api-express/defaultGateKeeper';
import { Chat } from '../../src/core/entities/chat';
import { User } from '../../src/core/entities/user';
import { ChatId } from '../../src/core/valueObjects/chatId';
import { sampleUser2 } from './samples';

export class ChatMother {
  private constructor() {
    //
  }

  static chat() {
    return new ChatMother.Builder();
  }

  private static Builder = class {
    private chatId = new ChatId('globallyUniqueId');
    private createdAt = new Date(2019);
    private participants: [User, User] = [
      DefaultGateKeeper.defaultUser,
      sampleUser2,
    ];

    withParticipants(participants: [User, User]): this {
      this.participants = participants;
      return this;
    }

    withTheSecondParticipant(participant: User): this {
      this.participants[1] = participant;
      return this;
    }

    build(): Chat {
      return new Chat(this.chatId, this.participants, this.createdAt);
    }
  };
}
