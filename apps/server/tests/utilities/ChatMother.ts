import { Chat } from '../../src/core/entities/chat';
import { User } from '../../src/core/entities/user';
import { ChatId } from '../../src/core/valueObjects/chatId';

export class ChatMother {
  private constructor() {
    //
  }

  static chatWithParticipants([user1, user2]: [User, User]): Chat {
    return new Chat(
      new ChatId('globallyUniqueId'),
      [user1, user2],
      new Date(2019)
    );
  }
}
