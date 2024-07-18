import { Message } from '../../core/domain/message';
import { SendMessageGateway } from '../../core/ports/sendMessageGateway';

type MessageSender = (text: string, chatId: string) => Promise<Message | null>;

export class SendMessageGatewayImpl implements SendMessageGateway {
  constructor(private sender: MessageSender) {}

  sendMessage(text: string, chatId: string): Promise<Message | null> {
    return this.sender(text, chatId);
  }
}
