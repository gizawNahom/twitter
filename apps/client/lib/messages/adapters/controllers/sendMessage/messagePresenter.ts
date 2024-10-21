import { Message } from '../../../core/domain/message';
import { formatTimeForMessage } from '../../../ui/utilities';

export class MessagePresenter {
  toMessageModel(message: Message) {
    return {
      id: message.id,
      text: message.text,
      chatId: message.chatId,
      senderId: message.senderId,
      time: formatTimeForMessage(new Date(message.createdAt)),
    };
  }
}
