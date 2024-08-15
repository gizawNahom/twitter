import { Message } from '../../core/domain/message';
import { SendMessageGateway } from '../../core/ports/sendMessageGateway';

export class SendMessageGatewayImpl implements SendMessageGateway {
  constructor(private sender: MessageSender) {}

  sendMessage(text: string, chatId: string): Promise<Message | null> {
    return this.sender.sendMessage(text, chatId);
  }
}

export interface MessageSender {
  sendMessage(text: string, chatId: string): Promise<Message>;
}
