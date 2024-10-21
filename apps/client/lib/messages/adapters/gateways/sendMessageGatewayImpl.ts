import { Message } from '../../core/domain/message';
import { SendMessageGateway } from '../../core/ports/sendMessageGateway';

export class SendMessageGatewayImpl implements SendMessageGateway {
  constructor(private sender: MessageSender) {}

  sendMessage(
    senderId: string,
    text: string,
    chatId: string
  ): Promise<Message> {
    return this.sender.sendMessage(senderId, text, chatId);
  }
}

export interface MessageSender {
  sendMessage(senderId: string, text: string, chatId: string): Promise<Message>;
}
