import { Message } from '../../src/core/entities/message';
import { MessageBuilder } from '../../src/core/messageBuilder';
import { ChatId } from '../../src/core/valueObjects/chatId';
import { MessageText } from '../../src/core/valueObjects/messageText';
import { sampleChatId, sampleUserId } from './samples';

export class MessageMother {
  private constructor() {
    //
  }

  static CompleteMessage(): Message {
    return MessageBuilder.message()
      .withId('globallyUniqueId')
      .withChatId(new ChatId(sampleChatId))
      .withCreatedAt(new Date(2011))
      .withSenderId(sampleUserId)
      .withText(new MessageText('hello'))
      .build();
  }
}
